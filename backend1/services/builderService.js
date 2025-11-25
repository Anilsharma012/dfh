const axios = require('axios');

const log = (...a) => console.log('[builderSync]', ...a);
const warn = (...a) => console.warn('[builderSync]', ...a);

const getEnv = () => ({
  writeKey: process.env.BUILDER_PRIVATE_API_KEY || process.env.BUILDER_WRITE_KEY || '',
  publicKey: process.env.BUILDER_PUBLIC_API_KEY || process.env.BUILDER_READ_KEY || '',
  model: process.env.BUILDER_COURSE_MODEL || process.env.BUILDER_MODEL || 'courses',
});

async function findExistingByCourseId(publicKey, model, courseId) {
  try {
    const url = `https://cdn.builder.io/api/v3/content/${encodeURIComponent(model)}?apiKey=${encodeURIComponent(publicKey)}&limit=1&query=${encodeURIComponent(JSON.stringify({ 'data.courseId': String(courseId) }))}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    const item = data?.results?.[0] || null;
    return item ? { id: item.id, data: item.data } : null;
  } catch (e) {
    warn('lookup failed', e?.response?.status || e.message);
    return null;
  }
}

async function upsertCourseOverviewToBuilder(course) {
  const { writeKey, publicKey, model } = getEnv();
  if (!writeKey || !publicKey || !model) {
    warn('missing Builder env, skipping sync');
    return { skipped: true };
  }
  if (!course || !course._id) {
    warn('invalid course payload');
    return { skipped: true };
  }

  const existing = await findExistingByCourseId(publicKey, model, course._id);

  const payload = {
    model,
    published: true,
    // builder content requires a name; use course name fallback
    name: course.name || `Course ${course._id}`,
    // when updating, include "id" to upsert
    ...(existing?.id ? { id: existing.id } : {}),
    data: {
      courseId: String(course._id),
      slug: course.slug || undefined,
      name: course.name,
      price: course.price,
      thumbnail: course.thumbnail,
      overview: {
        description: course.overview?.description || '',
        materialIncludes: Array.isArray(course.overview?.materialIncludes) ? course.overview.materialIncludes : [],
        requirements: Array.isArray(course.overview?.requirements) ? course.overview.requirements : [],
      },
    },
  };

  try {
    const url = 'https://builder.io/api/v1/write/content';
    const { data } = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${writeKey}` },
      timeout: 10000,
    });
    log('synced course to builder', { id: data?.id || existing?.id || null, model });
    return { success: true, id: data?.id || existing?.id || null };
  } catch (e) {
    warn('write failed', e?.response?.status || e.message);
    return { success: false, error: e?.response?.data || e.message };
  }
}

module.exports = { upsertCourseOverviewToBuilder };

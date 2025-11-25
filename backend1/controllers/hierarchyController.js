const ExamCategory = require('../models/ExamCategory');
const ExamYear = require('../models/ExamYear');
const ExamSlot = require('../models/ExamSlot');
const TopicCategory = require('../models/TopicCategory');
const TopicTestGroup = require('../models/TopicTestGroup');

// ============ EXAM CATEGORY ============
exports.getExamCategories = async (req, res) => {
  try {
    const categories = await ExamCategory.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExamCategory = async (req, res) => {
  try {
    const category = new ExamCategory(req.body);
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateExamCategory = async (req, res) => {
  try {
    const category = await ExamCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteExamCategory = async (req, res) => {
  try {
    const category = await ExamCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ EXAM YEAR ============
exports.getExamYears = async (req, res) => {
  try {
    const { examCategoryId } = req.query;
    const filter = { isActive: true };
    if (examCategoryId) filter.examCategoryId = examCategoryId;
    
    const years = await ExamYear.find(filter)
      .populate('examCategoryId')
      .sort({ displayOrder: 1, label: -1 });
    res.json({ success: true, years });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExamYear = async (req, res) => {
  try {
    const year = new ExamYear(req.body);
    await year.save();
    await year.populate('examCategoryId');
    res.json({ success: true, year });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateExamYear = async (req, res) => {
  try {
    const year = await ExamYear.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('examCategoryId');
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }
    res.json({ success: true, year });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteExamYear = async (req, res) => {
  try {
    const year = await ExamYear.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!year) {
      return res.status(404).json({ success: false, message: 'Year not found' });
    }
    res.json({ success: true, message: 'Year deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ EXAM SLOT ============
exports.getExamSlots = async (req, res) => {
  try {
    const { examYearId } = req.query;
    const filter = { isActive: true };
    if (examYearId) filter.examYearId = examYearId;
    
    const slots = await ExamSlot.find(filter)
      .populate({
        path: 'examYearId',
        populate: { path: 'examCategoryId' }
      })
      .sort({ displayOrder: 1, label: 1 });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExamSlot = async (req, res) => {
  try {
    const slot = new ExamSlot(req.body);
    await slot.save();
    await slot.populate({
      path: 'examYearId',
      populate: { path: 'examCategoryId' }
    });
    res.json({ success: true, slot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateExamSlot = async (req, res) => {
  try {
    const slot = await ExamSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'examYearId',
      populate: { path: 'examCategoryId' }
    });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, slot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteExamSlot = async (req, res) => {
  try {
    const slot = await ExamSlot.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ TOPIC CATEGORY ============
exports.getTopicCategories = async (req, res) => {
  try {
    const categories = await TopicCategory.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTopicCategory = async (req, res) => {
  try {
    const category = new TopicCategory(req.body);
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTopicCategory = async (req, res) => {
  try {
    const category = await TopicCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Topic Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTopicCategory = async (req, res) => {
  try {
    const category = await TopicCategory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Topic Category not found' });
    }
    res.json({ success: true, message: 'Topic Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ TOPIC TEST GROUP ============
exports.getTopicTestGroups = async (req, res) => {
  try {
    const { topicCategoryId } = req.query;
    const filter = { isActive: true };
    if (topicCategoryId) filter.topicCategoryId = topicCategoryId;
    
    const groups = await TopicTestGroup.find(filter)
      .populate('topicCategoryId')
      .sort({ displayOrder: 1, title: 1 });
    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTopicTestGroup = async (req, res) => {
  try {
    const group = new TopicTestGroup(req.body);
    await group.save();
    await group.populate('topicCategoryId');
    res.json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTopicTestGroup = async (req, res) => {
  try {
    const group = await TopicTestGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('topicCategoryId');
    if (!group) {
      return res.status(404).json({ success: false, message: 'Topic Test Group not found' });
    }
    res.json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTopicTestGroup = async (req, res) => {
  try {
    const group = await TopicTestGroup.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ success: false, message: 'Topic Test Group not found' });
    }
    res.json({ success: true, message: 'Topic Test Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

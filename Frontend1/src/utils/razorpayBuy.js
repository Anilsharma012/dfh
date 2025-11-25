// Razorpay checkout loader + global buy helper
import { toast } from 'react-toastify';

const loadRzp = () => new Promise((resolve, reject) => {
  if (window.__rzpLoaded) return resolve(true);
  const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existing) { window.__rzpLoaded = true; return resolve(true); }
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.async = true;
  s.onload = () => { window.__rzpLoaded = true; resolve(true); };
  s.onerror = (e) => reject(new Error('Failed to load Razorpay'));
  document.head.appendChild(s);
});

const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('token');

const headers = () => {
  const token = getToken();
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

async function createOrder({ courseId, userId, amountINR, courseName }) {
  const body = { courseId, userId, amount: Math.round(Number(amountINR) * 100), courseName };
  const res = await fetch('/api/pay/create-order', { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`create-order failed ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'create-order error');
  return data;
}

async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId }) {
  const res = await fetch('/api/pay/verify', { method: 'POST', headers: headers(), body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId }) });
  if (!res.ok) throw new Error(`verify failed ${res.status}`);
  return res.json();
}

window.buyCourse = async function(params) {
  try {
    const token = getToken();
    if (!token) { toast.error('Please login'); return; }
    await loadRzp();

    const orderData = await createOrder(params);
    const order = orderData.order || {};
    const key = orderData.keyId || 'rzp_test_JLdFnx7r5NMiBS';

    const options = {
      key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Tathagat Academy',
      description: params.courseName || 'Course Purchase',
      order_id: order.id,
      prefill: { email: params.userEmail || '', contact: params.userPhone || '' },
      method: { upi: true, card: true, netbanking: true, wallet: true },
      handler: async function (resp) {
        try {
          const v = await verifyPayment({ ...resp, courseId: params.courseId, userId: params.userId });
          if (v && v.success) {
            toast.success('Payment successful');
            try {
              // Try to hit dev unlock endpoint to ensure demo user enrolled (idempotent)
              fetch('/api/dev-payment/unlock-course-payment', {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ courseId: params.courseId })
              }).catch(() => {});
            } catch (e) {}

            // Mark just purchased course id and redirect to My Courses
            try { localStorage.setItem('justPurchasedCourseId', params.courseId); } catch(e) {}
            window.location = '/my-courses';
          } else {
            toast.error('Payment verification failed');
          }
        } catch (e) {
          console.error('verify error', e);
          toast.error('Payment verification failed');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('payment.failed', response);
      toast.error(response?.error?.description || 'Payment failed');
    });
    rzp.open();
  } catch (e) {
    console.error('buyCourse error', e);
    toast.error('Something went wrong');
  }
};

export {};

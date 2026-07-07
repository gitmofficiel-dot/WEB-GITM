import emailjs from '@emailjs/browser';

/**
 * Utility for sending email notifications via EmailJS.
 */
export const sendEmailNotification = async (templateId, templateParams) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_n8xjz34';
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
  if (!publicKey) {
    console.warn('[EmailJS] Public Key is missing. Using mock response.');
    console.log(`[EmailJS Mock] Sending email via template ${templateId}`);
    console.log('[EmailJS Mock] Parameters:', templateParams);
    
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, text: 'OK' });
      }, 1000);
    });
  }

  try {
    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return res;
  } catch (error) {
    console.error('[EmailJS] Error sending email:', error);
    throw error;
  }
};

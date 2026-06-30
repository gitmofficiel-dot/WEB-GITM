/**
 * Mock EmailJS utility for sending email notifications.
 * In a real environment, you would use @emailjs/browser
 */
export const sendEmailNotification = async (templateId, templateParams) => {
  console.log(`[EmailJS Mock] Sending email via template ${templateId}`);
  console.log('[EmailJS Mock] Parameters:', templateParams);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, text: 'OK' });
    }, 1000);
  });
};

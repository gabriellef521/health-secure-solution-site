/**
 * api/contact.js
 * Vercel serverless function replacing send-message-handler.php.
 * Handles the "Send Us A Message" form on contact.html.
 * Emails the submission straight to gabriellef@healthsecuresolution.com
 * via the Resend API, using the verified send.healthsecuresolution.com
 * sending domain.
 */

function cleanField(value) {
  return (value || '').toString().trim().replace(/[\r\n]/g, '');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
    return;
  }

  const body = req.body || {};
  const first_name = cleanField(body.first_name);
  const last_name = cleanField(body.last_name);
  const email = cleanField(body.email);
  const phone = cleanField(body.phone);
  const subject = cleanField(body.subject);
  const message = (body.message || '').toString().trim();

  if (!first_name || !email || !message || !isValidEmail(email)) {
    res.status(400).send('Please go back and fill out your name, a valid email, and a message.');
    return;
  }

  const emailSubject = `New website message from ${first_name} ${last_name}`.trim();

  const textBody =
    'New message submitted through the Contact Us form on healthsecuresolution.com:\n\n' +
    `Name: ${first_name} ${last_name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || '(not provided)'}\n` +
    `Subject: ${subject || '(none)'}\n\n` +
    `Message:\n${message}\n`;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Health Secure Solution Website <website@send.healthsecuresolution.com>',
        to: ['gabriellef@healthsecuresolution.com'],
        reply_to: email,
        subject: emailSubject,
        text: textBody,
      }),
    });

  if (!resendRes.ok) {
    const errText = await resendRes.text();
    console.error('Resend error:', resendRes.status, errText);
    res
    .status(500)
    .send('Sorry, something went wrong sending your message. Please email gabriellef@healthsecuresolution.com directly, or call 603 233 5480.');
    return;
  }

  res.writeHead(302, { Location: '/thank-you.html' });
    res.end();
  } catch (err) {
    console.error('Send error:', err);
    res
    .status(500)
    .send('Sorry, something went wrong sending your message. Please email gabriellef@healthsecuresolution.com directly, or call 603 233 5480.');
  }
};

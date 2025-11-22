// Email Service Configuration - TURN 3 OPTIONAL
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('⚠️ nodemailer not installed, email service optional');
}

let transporter;
let emailServiceEnabled = false;

const initializeEmailService = async () => {
  const provider = process.env.EMAIL_PROVIDER || 'gmail';

  try {
    if (provider === 'sendgrid') {
      try {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        transporter = sgMail;
        emailServiceEnabled = true;
        console.log('✅ SendGrid email service initialized');
      } catch (e) {
        console.warn('⚠️ SendGrid not configured');
      }
    } else if (provider === 'resend') {
      try {
        const { Resend } = require('resend');
        transporter = new Resend(process.env.RESEND_API_KEY);
        emailServiceEnabled = true;
        console.log('✅ Resend email service initialized');
      } catch (e) {
        console.warn('⚠️ Resend not configured');
      }
    } else if (nodemailer) {
      try {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
        emailServiceEnabled = true;
        console.log('✅ Gmail email service initialized');
      } catch (e) {
        console.warn('⚠️ Gmail email service not configured');
      }
    }
  } catch (error) {
    console.warn('⚠️ Email service initialization warning:', error.message);
  }
};

const sendEmail = async (to, subject, htmlContent) => {
  if (!emailServiceEnabled) {
    console.warn('⚠️ Email service disabled, skipping email');
    return false;
  }

  try {
    const provider = process.env.EMAIL_PROVIDER || 'gmail';

    if (provider === 'sendgrid') {
      await transporter.send({
        to,
        from: process.env.EMAIL_FROM || 'noreply@mynet.tn',
        subject,
        html: htmlContent
      });
    } else if (provider === 'resend') {
      await transporter.emails.send({
        to,
        from: process.env.EMAIL_FROM || 'noreply@mynet.tn',
        subject,
        html: htmlContent
      });
    } else if (nodemailer) {
      await transporter.sendMail({
        to,
        from: process.env.EMAIL_FROM || 'noreply@mynet.tn',
        subject,
        html: htmlContent
      });
    }

    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Email templates
const emailTemplates = {
  newOffer: (tenderId, supplierName, price) => ({
    subject: `New Offer for Your Tender #${tenderId}`,
    html: `
      <h2>New Offer Received</h2>
      <p>You have received a new offer for your tender.</p>
      <p><strong>Supplier:</strong> ${supplierName}</p>
      <p><strong>Price:</strong> $${price}</p>
      <a href="${process.env.FRONTEND_URL}/tenders/${tenderId}" style="background-color: #0056B3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Offer</a>
    `
  }),

  tenderUpdate: (tenderId, status) => ({
    subject: `Tender #${tenderId} Status Update`,
    html: `
      <h2>Tender Status Changed</h2>
      <p>Your tender has been ${status}.</p>
      <a href="${process.env.FRONTEND_URL}/tenders/${tenderId}" style="background-color: #0056B3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Tender</a>
    `
  }),

  newMessage: (senderName, senderCompany) => ({
    subject: `New Message from ${senderCompany}`,
    html: `
      <h2>You have a new message</h2>
      <p>From: <strong>${senderName}</strong> (${senderCompany})</p>
      <a href="${process.env.FRONTEND_URL}/messages" style="background-color: #0056B3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Read Message</a>
    `
  }),

  newReview: (reviewerName, rating) => ({
    subject: `New Review: ${rating} Stars from ${reviewerName}`,
    html: `
      <h2>You received a new review!</h2>
      <p>Rating: ${'⭐'.repeat(rating)}</p>
      <p>From: <strong>${reviewerName}</strong></p>
      <a href="${process.env.FRONTEND_URL}/reviews" style="background-color: #0056B3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Reviews</a>
    `
  })
};

module.exports = {
  initializeEmailService,
  sendEmail,
  emailTemplates
};

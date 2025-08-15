import nodemailer from 'nodemailer';
import winston from 'winston';

class MemoryEmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Support both custom domain SMTP and Gmail
      const emailConfig = this.getEmailConfiguration();

      this.transporter = nodemailer.createTransporter(emailConfig);

      // Verify connection
      await this.transporter.verify();
      winston.info('Memory email service initialized successfully');
    } catch (error) {
      winston.error('Failed to initialize memory email service:', error);
    }
  }

  getEmailConfiguration() {
    // Custom domain SMTP (preferred)
    if (process.env.EMAIL_HOST) {
      return {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD, // Regular email password
        },
      };
    }

    // Gmail fallback
    return {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'memories@theporadas.com',
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
    };
  }

  async sendGuestbookThankYou(guestEntry) {
    const emailTemplate = this.createGuestbookThankYouTemplate(guestEntry);

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Austin & Jordyn'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER}>`,
        to: guestEntry.email,
        replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM_ADDRESS,
        subject: `Thank you for your beautiful memory, ${guestEntry.name}! 💕`,
        html: emailTemplate,
        text: this.createPlainTextThankYou(guestEntry),
      });

      winston.info(`Thank you email sent to ${guestEntry.email} for guestbook entry`);
      return { success: true };
    } catch (error) {
      winston.error(`Failed to send thank you email to ${guestEntry.email}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendPhotoUploadThankYou(photoUpload) {
    const emailTemplate = this.createPhotoThankYouTemplate(photoUpload);

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Austin & Jordyn'}" <${process.env.EMAIL_USER}>`,
        to: photoUpload.uploaderEmail,
        replyTo: process.env.EMAIL_REPLY_TO,
        subject: `Thank you for sharing your wedding photos! 📸`,
        html: emailTemplate,
        text: this.createPlainTextPhotoThankYou(photoUpload),
      });

      winston.info(`Photo upload thank you email sent to ${photoUpload.uploaderEmail}`);
      return { success: true };
    } catch (error) {
      winston.error(`Failed to send photo thank you email:`, error);
      return { success: false, error: error.message };
    }
  }

  async sendAnniversaryMemory(recipient, anniversaryData) {
    const emailTemplate = this.createAnniversaryTemplate(anniversaryData);

    try {
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Austin & Jordyn'}" <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        replyTo: process.env.EMAIL_REPLY_TO,
        subject: `💕 Celebrating Our ${anniversaryData.yearsAgo} Year Anniversary - Memories with You!`,
        html: emailTemplate,
        text: this.createPlainTextAnniversary(anniversaryData),
      });

      winston.info(`Anniversary memory email sent to ${recipient.email}`);
      return { success: true };
    } catch (error) {
      winston.error(`Failed to send anniversary email:`, error);
      return { success: false, error: error.message };
    }
  }

  createGuestbookThankYouTemplate(guestEntry) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .email-container {
          font-family: 'Georgia', serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fdf7f0;
        }
        .header {
          text-align: center;
          color: #8B4513;
          border-bottom: 2px solid #D4AF37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .message {
          line-height: 1.6;
          color: #333;
          font-size: 16px;
        }
        .highlight {
          background-color: #f0e6d2;
          padding: 15px;
          border-left: 4px solid #D4AF37;
          margin: 20px 0;
          font-style: italic;
        }
        .signature {
          margin-top: 30px;
          text-align: center;
          color: #8B4513;
        }
        .link {
          color: #8B4513;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>💕 Thank You, ${guestEntry.name}! 💕</h1>
        </div>

        <div class="message">
          <p>Dear ${guestEntry.name},</p>

          <p>We are absolutely touched by your beautiful message in our wedding guestbook! Your words mean the world to us and will be treasured forever as part of our special day.</p>

          <div class="highlight">
            "${guestEntry.message}"
          </div>

          <p>Your presence at our wedding (whether in person or in spirit) and now your thoughtful words have made our celebration even more meaningful. We're so grateful to have you as part of our journey together.</p>

          <p>Please feel free to continue visiting our memory site to:</p>
          <ul>
            <li>View more wedding photos as we add them</li>
            <li>Share any photos you took during our special day</li>
            <li>Leave additional memories and messages</li>
            <li>See what other guests have shared</li>
          </ul>

          <p>Visit our memory site anytime: <a href="${process.env.BASE_URL}" class="link">www.theporadas.com</a></p>

          <p>With all our love and gratitude,</p>
        </div>

        <div class="signature">
          <h3>💖 Austin & Jordyn Porada 💖</h3>
          <p><em>Creating beautiful memories together</em></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  createPhotoThankYouTemplate(photoUpload) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .email-container {
          font-family: 'Georgia', serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fdf7f0;
        }
        .header {
          text-align: center;
          color: #8B4513;
          border-bottom: 2px solid #D4AF37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .message {
          line-height: 1.6;
          color: #333;
          font-size: 16px;
        }
        .signature {
          margin-top: 30px;
          text-align: center;
          color: #8B4513;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📸 Thank You for Sharing Photos! 📸</h1>
        </div>

        <div class="message">
          <p>Dear ${photoUpload.uploaderName},</p>

          <p>Thank you so much for sharing your photos from our wedding day! We're thrilled to see our special moments captured through your eyes.</p>

          <p>Your photos are now part of our memory collection and will be reviewed shortly. Once approved, they'll be visible to all our family and friends visiting the site.</p>

          <p>We're building a beautiful collection of memories from everyone who celebrated with us, and your contribution makes it even more special.</p>

          <p>Feel free to upload more photos anytime at: <a href="${process.env.BASE_URL}/upload" style="color: #8B4513;">www.theporadas.com/upload</a></p>

          <p>With heartfelt appreciation,</p>
        </div>

        <div class="signature">
          <h3>💖 Austin & Jordyn Porada 💖</h3>
          <p><em>Collecting beautiful memories together</em></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  createAnniversaryTemplate(anniversaryData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .email-container {
          font-family: 'Georgia', serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fdf7f0;
        }
        .header {
          text-align: center;
          color: #8B4513;
          border-bottom: 2px solid #D4AF37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .anniversary-highlight {
          background-color: #f0e6d2;
          padding: 20px;
          border: 2px solid #D4AF37;
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>💕 ${anniversaryData.yearsAgo} Year Anniversary! 💕</h1>
        </div>

        <div class="anniversary-highlight">
          <h2>Celebrating Our Love Story</h2>
          <p><strong>${anniversaryData.yearsAgo} year${anniversaryData.yearsAgo !== 1 ? 's' : ''} ago today, we said "I do!"</strong></p>
        </div>

        <div class="message">
          <p>Dear Friends and Family,</p>

          <p>Today marks ${anniversaryData.yearsAgo} wonderful year${anniversaryData.yearsAgo !== 1 ? 's' : ''} since our wedding day, and we wanted to share this special milestone with everyone who made our day so memorable.</p>

          <p>Your love, support, and presence (whether in person or in spirit) helped make our wedding day absolutely perfect. As we celebrate this anniversary, we're reminded of all the beautiful memories we created together.</p>

          <p>Visit our memory site to:</p>
          <ul>
            <li>Relive the beautiful moments from our wedding day</li>
            <li>See photos and memories you might have missed</li>
            <li>Share any new thoughts or memories you'd like to add</li>
            <li>See how our love story continues to grow</li>
          </ul>

          <p>Thank you for continuing to be part of our journey together.</p>

          <p>Visit: <a href="${process.env.BASE_URL}" style="color: #8B4513;">www.theporadas.com</a></p>

          <p>With love and gratitude,</p>
        </div>

        <div class="signature">
          <h3>💖 Austin & Jordyn Porada 💖</h3>
          <p><em>Still creating beautiful memories together</em></p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  createPlainTextThankYou(guestEntry) {
    return `
Dear ${guestEntry.name},

Thank you so much for your beautiful message in our wedding guestbook! Your words mean the world to us and will be treasured forever.

Your message: "${guestEntry.message}"

We're so grateful to have you as part of our journey together. Please visit our memory site anytime at www.theporadas.com to view more photos and share additional memories.

With all our love,
Austin & Jordyn Porada
    `;
  }

  createPlainTextPhotoThankYou(photoUpload) {
    return `
Dear ${photoUpload.uploaderName},

Thank you for sharing your photos from our wedding day! We're thrilled to see our special moments through your eyes.

Your photos will be reviewed and added to our memory collection soon. Feel free to upload more anytime at www.theporadas.com/upload.

With heartfelt appreciation,
Austin & Jordyn Porada
    `;
  }

  createPlainTextAnniversary(anniversaryData) {
    return `
Dear Friends and Family,

Today marks ${anniversaryData.yearsAgo} wonderful year${anniversaryData.yearsAgo !== 1 ? 's' : ''} since our wedding day! We wanted to share this special milestone with everyone who made our day so memorable.

Visit our memory site at www.theporadas.com to relive the beautiful moments and share any new memories.

Thank you for continuing to be part of our journey together.

With love and gratitude,
Austin & Jordyn Porada
    `;
  }
}

export default MemoryEmailService;

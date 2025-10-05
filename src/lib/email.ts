/**
 * Email Service Utility
 *
 * Handles sending emails using Nodemailer
 */

import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// Email configuration interface
export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Email template interfaces
export interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Create email transporter
 */
function createTransporter(): Transporter | null {
  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email not configured. Emails will not be sent.')
    return null
  }

  const config: EmailConfig = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  }

  return nodemailer.createTransport(config)
}

/**
 * Send notification email to admin when contact form is submitted
 */
export async function sendAdminNotification(data: ContactEmailData): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      // Email not configured - log and return success (don't break the flow)
      console.log('Email not configured. Skipping admin notification.')
      return { success: true }
    }

    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      console.warn('ADMIN_EMAIL not configured. Skipping notification.')
      return { success: true }
    }

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${data.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p>This message was sent from your portfolio contact form.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent from your portfolio contact form.
      `,
    }

    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

/**
 * Send confirmation email to user after contact form submission
 */
export async function sendUserConfirmation(data: ContactEmailData): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    if (!transporter) {
      // Email not configured - log and return success (don't break the flow)
      console.log('Email not configured. Skipping user confirmation.')
      return { success: true }
    }

    const mailOptions = {
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: 'Thank you for contacting me!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 20px; border-radius: 6px; border-left: 3px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Thank You for Getting in Touch!</h2>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>
              <p>Thank you for contacting me! I've received your message and will get back to you as soon as possible.</p>

              <div class="message-box">
                <h3 style="margin-top: 0; color: #4b5563;">Your Message:</h3>
                <p style="margin: 0;"><strong>Subject:</strong> ${data.subject}</p>
                <p style="margin-top: 10px;">${data.message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out to me directly at ${process.env.ADMIN_EMAIL || 'my email'}.</p>

              <div class="footer">
                <p>Best regards,<br>Your Name</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${data.name},

Thank you for contacting me! I've received your message and will get back to you as soon as possible.

Your Message:
Subject: ${data.subject}
${data.message}

I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out to me directly at ${process.env.ADMIN_EMAIL || 'my email'}.

Best regards,
Your Name
      `,
    }

    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error('Error sending user confirmation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

/**
 * Send both admin notification and user confirmation
 */
export async function sendContactFormEmails(data: ContactEmailData): Promise<{
  admin: EmailResult
  user: EmailResult
}> {
  const [admin, user] = await Promise.all([
    sendAdminNotification(data),
    sendUserConfirmation(data),
  ])

  return { admin, user }
}

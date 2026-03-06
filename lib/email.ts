import { Resend } from 'resend'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }
  return new Resend(apiKey)
}

const FROM_EMAIL = 'CourseHub <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'delivered@resend.dev'

export async function sendConfirmationEmail(name: string, email: string) {
  const resend = getResend()

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to CourseHub! Your Registration is Confirmed',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0F172A; color: #F1F5F9; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">CourseHub</h1>
        </div>
        <h2 style="color: #F1F5F9; font-size: 22px;">Welcome aboard, ${name}!</h2>
        <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">
          Thank you for registering with CourseHub. Your registration has been confirmed and we're excited to have you join our community of learners.
        </p>
        <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">
          We'll be in touch soon with more details about upcoming courses and exclusive learning opportunities.
        </p>
        <div style="text-align: center; margin-top: 32px; padding: 20px; background: #1E293B; border-radius: 8px;">
          <p style="color: #7C3AED; font-weight: 600; margin: 0;">Stay tuned for exciting updates!</p>
        </div>
        <p style="color: #64748B; font-size: 12px; margin-top: 32px; text-align: center;">
          &copy; ${new Date().getFullYear()} CourseHub. All rights reserved.
        </p>
      </div>
    `,
  })
}

export async function sendAdminNotification(
  name: string,
  email: string,
  phone: string | null,
  level: string | null,
  motivation: string | null,
) {
  const resend = getResend()

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Registration: ${name}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0F172A; color: #F1F5F9; padding: 40px; border-radius: 12px;">
        <h2 style="color: #7C3AED;">New Course Registration</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; color: #94A3B8;">Name</td><td style="padding: 8px; color: #F1F5F9;">${name}</td></tr>
          <tr><td style="padding: 8px; color: #94A3B8;">Email</td><td style="padding: 8px; color: #F1F5F9;">${email}</td></tr>
          <tr><td style="padding: 8px; color: #94A3B8;">Phone</td><td style="padding: 8px; color: #F1F5F9;">${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; color: #94A3B8;">Level</td><td style="padding: 8px; color: #F1F5F9;">${level || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; color: #94A3B8;">Motivation</td><td style="padding: 8px; color: #F1F5F9;">${motivation || 'N/A'}</td></tr>
        </table>
      </div>
    `,
  })
}

export async function sendNewsletter(
  emails: string[],
  subject: string,
  message: string,
) {
  const resend = getResend()

  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)

    await Promise.allSettled(
      batch.map((email) =>
        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0F172A; color: #F1F5F9; padding: 40px; border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #7C3AED; font-size: 28px; margin: 0;">CourseHub</h1>
              </div>
              <div style="color: #F1F5F9; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              <p style="color: #64748B; font-size: 12px; margin-top: 32px; text-align: center;">
                &copy; ${new Date().getFullYear()} CourseHub. All rights reserved.
              </p>
            </div>
          `,
        }),
      ),
    )
  }
}

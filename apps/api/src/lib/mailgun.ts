import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { env } from '../config/env';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: env.MAILGUN_API_KEY,
});

const DOMAIN = env.MAILGUN_DOMAIN;
const SENDER = env.MAILGUN_SENDER;

async function sendEmail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  try {
    await mg.messages.create(DOMAIN, {
      from: SENDER,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
  } catch (err: any) {
    throw new Error(`Failed to send email: ${err?.message || err}`);
  }
}

export async function sendVerificationOtpEmail(to: string, otp: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Verify your email',
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <b>${otp}</b></p>`,
  });
}

export async function sendResetPasswordEmail(to: string, otp: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reset your password',
    text: `Your password reset code is: ${otp}`,
    html: `<p>Your password reset code is: <b>${otp}</b></p>`,
  });
}

export async function sendNewApplicationNotificationEmail(params: {
  to: string;
  jobTitle: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: 'New application received for your job posting',
    text:
      `A new application has been submitted for your job posting.\n\n` +
      `Job Title: ${params.jobTitle}\n`,
    html:
      `<p>A new application has been submitted for your job posting.</p>` +
      `<p><b>Job Title:</b> ${params.jobTitle}</p>`,
  });
}

export async function sendNewApplicationNotificationEmailOld(params: {
  to: string;
  jobTitle: string;
  candidateEmail: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: 'New application received for your job posting',
    text:
      `A new application has been submitted for your job posting.\n\n` +
      `Job Title: ${params.jobTitle}\n` +
      `Candidate Email: ${params.candidateEmail}\n`,
    html:
      `<p>A new application has been submitted for your job posting.</p>` +
      `<p><b>Job Title:</b> ${params.jobTitle}</p>` +
      `<p><b>Candidate Email:</b> ${params.candidateEmail}</p>`,
  });
}

export async function sendApplicationStatusUpdatedEmail(params: {
  to: string;
  jobTitle: string;
  status: string;
}): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: 'Your application status has been updated',
    text:
      `Your application status has been updated.\n\n` +
      `Job Title: ${params.jobTitle}\n` +
      `New Status: ${params.status}\n`,
    html:
      `<p>Your application status has been updated.</p>` +
      `<p><b>Job Title:</b> ${params.jobTitle}</p>` +
      `<p><b>New Status:</b> ${params.status}</p>`,
  });
}
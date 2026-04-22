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

export async function sendVerificationOtpEmail(to: string, otp: string): Promise<void> {
	try {
		await mg.messages.create(DOMAIN, {
			from: SENDER,
			to: [to],
			subject: 'Verify your email',
			text: `Your verification code is: ${otp}`,
			html: `<p>Your verification code is: <b>${otp}</b></p>`
		});
	} catch (err: any) {
		throw new Error(`Failed to send verification email: ${err?.message || err}`);
	}
}

export async function sendResetPasswordEmail(to: string, otp: string): Promise<void> {
	try {
		await mg.messages.create(DOMAIN, {
			from: SENDER,
			to: [to],
			subject: 'Reset your password',
			text: `Your password reset code is: ${otp}`,
			html: `<p>Your password reset code is: <b>${otp}</b></p>`
		});
	} catch (err: any) {
		throw new Error(`Failed to send reset password email: ${err?.message || err}`);
	}
}

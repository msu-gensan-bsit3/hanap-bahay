import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import SMTP2GO from "smtp2go-nodejs";
import { generateSessionToken } from "../auth";
const { ApiClient, MailService } = SMTP2GO;

export const MAIL_VERIFICATION_KEY = env.MAIL_VERIFICATION_KEY || generateSessionToken();

if ((!env.SMTP2GO_API_KEY || !env.SMTP2GO_SENDER_EMAIL) && !building) {
	throw "SMTP2GO API KEY and SENDER EMAIL needed";
}

const api = new ApiClient(env.SMTP2GO_API_KEY);

export async function sendMailCode(email: string, code: string) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email })
		.subject(`Email Code [${code}]`).html(`
			<h3>Hey there,</h3>
			<br>
			Your Verification Code:
			<br>
			<h2>${code}</h2>
			<br>
			Do not reply.
		`);

	await api.consume(newMail);
	console.log("Email sent to", email);
}
export async function sendForgotPasswordMail(email: string, name: string, link: string) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email })
		.subject("Reset Password").html(`
			<h3>Hey there ${name},</h3>
			<br>
			Click <a href="${link}">here</a> to reset password or
			<br>
			${link}
			<br>
			Do not reply.
		`);

	await api.consume(newMail);
	console.log("Email sent to", email);
}

export async function sendNewListingNotification(
	agentEmail: string, 
	agentName: string, 
	propertyName: string, 
	propertyAddress: string, 
	sellerName: string,
	listingId: number
) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email: agentEmail })
		.subject("New Property Listing Submitted").html(`
			<h3>Hello ${agentName},</h3>
			<br>
			A new property listing has been submitted and assigned to you:
			<br><br>
			<strong>Property:</strong> ${propertyName}<br>
			<strong>Location:</strong> ${propertyAddress}<br>
			<strong>Submitted by:</strong> ${sellerName}<br>
			<br>
			Please review and verify the listing details in your dashboard.
			<br>
			<a href="${env.PUBLIC_BASE_URL || 'http://localhost:5173'}/agent/listings/${listingId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Listing</a>
			<br><br>
			Best regards,<br>
			JuanHomes Team
		`);

	await api.consume(newMail);
	console.log("New listing notification sent to", agentEmail);
}

export async function sendNewOfferNotification(
	agentEmail: string,
	agentName: string,
	propertyName: string,
	buyerName: string,
	offerId: number,
	listingId: number
) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email: agentEmail })
		.subject("New Offer Received").html(`
			<h3>Hello ${agentName},</h3>
			<br>
			You have received a new offer for one of your listings:
			<br><br>
			<strong>Property:</strong> ${propertyName}<br>
			<strong>Buyer:</strong> ${buyerName}<br>
			<br>
			Please review the offer details and respond to the buyer.
			<br>
			<a href="${env.PUBLIC_BASE_URL || 'http://localhost:5173'}/agent/offers/${offerId}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Offer</a>
			<br><br>
			Best regards,<br>
			JuanHomes Team
		`);

	await api.consume(newMail);
	console.log("New offer notification sent to", agentEmail);
}

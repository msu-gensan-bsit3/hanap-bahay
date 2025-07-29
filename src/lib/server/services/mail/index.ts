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
		.subject(`Email Verification Code - JuanHomes`).html(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Email Verification - JuanHomes</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
				<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
					<!-- Header -->
					<div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 40px 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">JuanHomes</h1>
						<p style="color: #e6f3ff; margin: 10px 0 0 0; font-size: 16px;">Real Estate Platform</p>
					</div>
					
					<!-- Content -->
					<div style="padding: 40px 30px;">
						<h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Email Verification</h2>
						<p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
							Welcome to JuanHomes! Please use the verification code below to verify your email address:
						</p>
						
						<!-- Verification Code Box -->
						<div style="background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
							<p style="color: #666666; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
							<div style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 4px; font-family: 'Courier New', monospace;">${code}</div>
						</div>
						
						<p style="color: #666666; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6;">
							This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
						</p>
					</div>
					
					<!-- Footer -->
					<div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #dee2e6;">
						<p style="color: #6c757d; margin: 0; font-size: 12px; text-align: center;">
							© 2025 JuanHomes. This is an automated message, please do not reply.
						</p>
					</div>
				</div>
			</body>
			</html>
		`);

	await api.consume(newMail);
	console.log("Email sent to", email);
}
export async function sendForgotPasswordMail(email: string, name: string, link: string) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email })
		.subject("Reset Your Password - JuanHomes").html(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Password Reset - JuanHomes</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
				<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
					<!-- Header -->
					<div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 40px 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">JuanHomes</h1>
						<p style="color: #f8d7da; margin: 10px 0 0 0; font-size: 16px;">Real Estate Platform</p>
					</div>
					
					<!-- Content -->
					<div style="padding: 40px 30px;">
						<h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
						<p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
							Hello <strong>${name}</strong>,
						</p>
						<p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
							We received a request to reset your password for your JuanHomes account. Click the button below to create a new password:
						</p>
						
						<!-- Reset Button -->
						<div style="text-align: center; margin: 40px 0;">
							<a href="${link}" style="display: inline-block; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3); transition: all 0.3s ease;">Reset Password</a>
						</div>
						
						<p style="color: #666666; margin: 20px 0; font-size: 14px; line-height: 1.6;">
							If the button doesn't work, you can copy and paste this link into your browser:
						</p>
						<div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin: 15px 0; word-break: break-all;">
							<a href="${link}" style="color: #007bff; text-decoration: none; font-size: 14px;">${link}</a>
						</div>
						
						<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
							<p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
								<strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
							</p>
						</div>
					</div>
					
					<!-- Footer -->
					<div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #dee2e6;">
						<p style="color: #6c757d; margin: 0; font-size: 12px; text-align: center;">
							© 2025 JuanHomes. This is an automated message, please do not reply.
						</p>
					</div>
				</div>
			</body>
			</html>
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
	listingId: number,
) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email: agentEmail })
		.subject("New Property Listing Assignment - JuanHomes").html(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>New Listing Assignment - JuanHomes</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
				<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
					<!-- Header -->
					<div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">JuanHomes</h1>
						<p style="color: #d4edda; margin: 10px 0 0 0; font-size: 16px;">Agent Dashboard</p>
					</div>
					
					<!-- Content -->
					<div style="padding: 40px 30px;">
						<div style="display: flex; align-items: center; margin-bottom: 20px;">
							<div style="background-color: #28a745; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
								<span style="color: white; font-size: 20px;">🏠</span>
							</div>
							<h2 style="color: #333333; margin: 0; font-size: 24px; font-weight: 600;">New Property Assignment</h2>
						</div>
						
						<p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
							Hello <strong>${agentName}</strong>,
						</p>
						
						<p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
							A new property listing has been submitted and assigned to you for review and verification.
						</p>
						
						<!-- Property Details Card -->
						<div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 25px; margin: 30px 0;">
							<h3 style="color: #28a745; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Property Details</h3>
							<div style="margin-bottom: 15px;">
								<span style="color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Property Name</span>
								<p style="color: #333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${propertyName}</p>
							</div>
							<div style="margin-bottom: 15px;">
								<span style="color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Location</span>
								<p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${propertyAddress}</p>
							</div>
							<div>
								<span style="color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Submitted By</span>
								<p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${sellerName}</p>
							</div>
						</div>
						
						<!-- Action Required -->
						<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
							<h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Action Required</h4>
							<p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
								Please review the listing details, verify all information, and update the status in your dashboard.
							</p>
						</div>
						
						<!-- Action Button -->
						<div style="text-align: center; margin: 40px 0;">
							<a href="${env.PUBLIC_BASE_URL || "http://localhost:5173"}/agent/listings/${listingId}" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);">Review Listing</a>
						</div>
					</div>
					
					<!-- Footer -->
					<div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #dee2e6;">
						<p style="color: #6c757d; margin: 0; font-size: 12px; text-align: center;">
							© 2025 JuanHomes. This is an automated message, please do not reply.
						</p>
					</div>
				</div>
			</body>
			</html>
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
	listingId: number,
) {
	const newMail = new MailService()
		.from({ email: env.SMTP2GO_SENDER_EMAIL, name: "JuanHomes" })
		.to({ email: agentEmail })
		.subject("New Offer Received - JuanHomes").html(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>New Offer - JuanHomes</title>
			</head>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
				<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
					<!-- Header -->
					<div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); padding: 40px 30px; text-align: center;">
						<h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">JuanHomes</h1>
						<p style="color: #fff3cd; margin: 10px 0 0 0; font-size: 16px;">Agent Dashboard</p>
					</div>
					
					<!-- Content -->
					<div style="padding: 40px 30px;">
						<div style="display: flex; align-items: center; margin-bottom: 20px;">
							<div style="background-color: #ffc107; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
								<span style="color: white; font-size: 20px;">💰</span>
							</div>
							<h2 style="color: #333333; margin: 0; font-size: 24px; font-weight: 600;">New Offer Received!</h2>
						</div>
						
						<p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
							Hello <strong>${agentName}</strong>,
						</p>
						
						<p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
							Great news! You have received a new offer for one of your property listings.
						</p>
						
						<!-- Offer Details Card -->
						<div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 25px; margin: 30px 0;">
							<h3 style="color: #ffc107; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Offer Details</h3>
							<div style="margin-bottom: 15px;">
								<span style="color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Property</span>
								<p style="color: #333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${propertyName}</p>
							</div>
							<div>
								<span style="color: #6c757d; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Buyer</span>
								<p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${buyerName}</p>
							</div>
						</div>
						
						<!-- Urgency Notice -->
						<div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
							<h4 style="color: #0c5460; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⏰ Time Sensitive</h4>
							<p style="color: #0c5460; margin: 0; font-size: 14px; line-height: 1.6;">
								Please review this offer promptly and respond to maintain good client relationships and maximize your sales opportunities.
							</p>
						</div>
						
						<!-- Action Button -->
						<div style="text-align: center; margin: 40px 0;">
							<a href="${env.PUBLIC_BASE_URL || "http://localhost:5173"}/agent/offers/${offerId}" style="display: inline-block; background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);">Review Offer</a>
						</div>
						
						<p style="color: #666666; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6; text-align: center;">
							Need help managing offers? Contact our support team for assistance.
						</p>
					</div>
					
					<!-- Footer -->
					<div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #dee2e6;">
						<p style="color: #6c757d; margin: 0; font-size: 12px; text-align: center;">
							© 2025 JuanHomes. This is an automated message, please do not reply.
						</p>
					</div>
				</div>
			</body>
			</html>
		`);

	await api.consume(newMail);
	console.log("New offer notification sent to", agentEmail);
}

import z from "zod";

export const askAiSchema = z.object({
	chatInput: z.string(),
	sessionId: z.string(),
});

export const loginSchema = z.object({
	identifier: z.string().min(1, "Email or username is required"),
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.email("Please enter a valid email address"),
		username: z.string().min(3, "Username must be at least 3 characters"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		birthDate: z.string().min(1, "Birth date is required"),
		mobileNumber: z.string().min(1, "Mobile number is required"),
		street: z.string().optional(),
		barangay: z.string().min(1, "Barangay is required"),
		city: z.string().min(1, "City is required"),
		province: z.string().min(1, "Province is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

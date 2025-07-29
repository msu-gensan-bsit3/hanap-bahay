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

export const listingSchema = z.object({
	// Property details
	name: z.string().min(1, "Property name is required"),
	description: z.string().optional(),
	type: z.enum(["rent", "sale", "lease"], {
		required_error: "Property type is required",
	}),
	category: z.enum([
		"house-and-lot",
		"apartment",
		"boarding-house",
		"townhouse",
		"condominium",
		"building",
		"office",
		"commercial-lot",
		"residential-lot",
		"industrial-lot",
	], {
		required_error: "Property category is required",
	}),
	price: z.number().min(0, "Price must be a positive number"),
	landArea: z.number().min(1, "Land area is required"),
	floorArea: z.number().optional(),
	bedrooms: z.number().optional(),
	bathrooms: z.number().optional(),
	carSpace: z.number().optional(),

	// Address details
	street: z.string().optional(),
	barangay: z.string().min(1, "Barangay is required"),
	city: z.string().min(1, "City is required"),
	province: z.string().min(1, "Province is required"),

	// Location coordinates
	latitude: z.string().min(1, "Latitude is required"),
	longitude: z.string().min(1, "Longitude is required"),

	// Property features and tags
	features: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
});

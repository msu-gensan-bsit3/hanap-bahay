<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	let { form } = $props();

	let loading = $state(false);
	let formData = $state({
		firstName: form?.data?.firstName || "",
		lastName: form?.data?.lastName || "",
		email: form?.data?.email || "",
		username: form?.data?.username || "",
		password: "",
		confirmPassword: "",
		birthDate: form?.data?.birthDate || "",
		mobileNumber: form?.data?.mobileNumber || "",
		street: form?.data?.street || "",
		barangay: form?.data?.barangay || "",
		city: form?.data?.city || "",
		province: form?.data?.province || "",
	});

	const philippineProvinces = [
		"Abra",
		"Agusan del Norte",
		"Agusan del Sur",
		"Aklan",
		"Albay",
		"Antique",
		"Apayao",
		"Aurora",
		"Basilan",
		"Bataan",
		"Batanes",
		"Batangas",
		"Benguet",
		"Biliran",
		"Bohol",
		"Bukidnon",
		"Bulacan",
		"Cagayan",
		"Camarines Norte",
		"Camarines Sur",
		"Camiguin",
		"Capiz",
		"Catanduanes",
		"Cavite",
		"Cebu",
		"Compostela Valley",
		"Cotabato",
		"Davao del Norte",
		"Davao del Sur",
		"Davao Occidental",
		"Davao Oriental",
		"Dinagat Islands",
		"Eastern Samar",
		"Guimaras",
		"Ifugao",
		"Ilocos Norte",
		"Ilocos Sur",
		"Iloilo",
		"Isabela",
		"Kalinga",
		"Laguna",
		"Lanao del Norte",
		"Lanao del Sur",
		"La Union",
		"Leyte",
		"Maguindanao",
		"Marinduque",
		"Masbate",
		"Metro Manila",
		"Misamis Occidental",
		"Misamis Oriental",
		"Mountain Province",
		"Negros Occidental",
		"Negros Oriental",
		"Northern Samar",
		"Nueva Ecija",
		"Nueva Vizcaya",
		"Occidental Mindoro",
		"Oriental Mindoro",
		"Palawan",
		"Pampanga",
		"Pangasinan",
		"Quezon",
		"Quirino",
		"Rizal",
		"Romblon",
		"Samar",
		"Sarangani",
		"Siquijor",
		"Sorsogon",
		"South Cotabato",
		"Southern Leyte",
		"Sultan Kudarat",
		"Sulu",
		"Surigao del Norte",
		"Surigao del Sur",
		"Tarlac",
		"Tawi-Tawi",
		"Zambales",
		"Zamboanga del Norte",
		"Zamboanga del Sur",
		"Zamboanga Sibugay",
	];
</script>

<svelte:head>
	<title>Register - JuanHome</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
	<div class="w-full max-w-2xl space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-gray-900">Create Your Account</h1>
			<p class="mt-2 text-sm text-gray-600">Join JuanHome and start your real estate journey</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Fill in your information to create your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					method="POST"
					action="?/register"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
					class="space-y-6"
				>
					<!-- Personal Information -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="firstName">First Name *</Label>
							<Input
								id="firstName"
								name="firstName"
								type="text"
								bind:value={formData.firstName}
								placeholder="Enter your first name"
								class={form?.errors?.firstName ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.firstName}
								<p class="text-sm text-red-600">{form.errors.firstName[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="lastName">Last Name *</Label>
							<Input
								id="lastName"
								name="lastName"
								type="text"
								bind:value={formData.lastName}
								placeholder="Enter your last name"
								class={form?.errors?.lastName ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.lastName}
								<p class="text-sm text-red-600">{form.errors.lastName[0]}</p>
							{/if}
						</div>
					</div>

					<!-- Account Credentials -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="email">Email Address *</Label>
							<Input
								id="email"
								name="email"
								type="email"
								autocomplete="email"
								bind:value={formData.email}
								placeholder="Enter your email"
								class={form?.errors?.email ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.email}
								<p class="text-sm text-red-600">{form.errors.email[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="username">Username *</Label>
							<Input
								id="username"
								name="username"
								type="text"
								autocomplete="username"
								bind:value={formData.username}
								placeholder="Choose a username"
								class={form?.errors?.username ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.username}
								<p class="text-sm text-red-600">{form.errors.username[0]}</p>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="password">Password *</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autocomplete="new-password"
								bind:value={formData.password}
								placeholder="Create a password"
								class={form?.errors?.password ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.password}
								<p class="text-sm text-red-600">{form.errors.password[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="confirmPassword">Confirm Password *</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autocomplete="new-password"
								bind:value={formData.confirmPassword}
								placeholder="Confirm your password"
								class={form?.errors?.confirmPassword ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.confirmPassword}
								<p class="text-sm text-red-600">{form.errors.confirmPassword[0]}</p>
							{/if}
						</div>
					</div>

					<!-- Personal Details -->
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="birthDate">Birth Date *</Label>
							<Input
								id="birthDate"
								name="birthDate"
								type="date"
								bind:value={formData.birthDate}
								class={form?.errors?.birthDate ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.birthDate}
								<p class="text-sm text-red-600">{form.errors.birthDate[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="mobileNumber">Mobile Number *</Label>
							<Input
								id="mobileNumber"
								name="mobileNumber"
								type="tel"
								bind:value={formData.mobileNumber}
								placeholder="+639XXXXXXXXX"
								class={form?.errors?.mobileNumber ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.mobileNumber}
								<p class="text-sm text-red-600">{form.errors.mobileNumber[0]}</p>
							{/if}
						</div>
					</div>

					<!-- Address Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-medium text-gray-900">Address Information</h3>

						<div class="space-y-2">
							<Label for="street">Street Address</Label>
							<Input
								id="street"
								name="street"
								type="text"
								bind:value={formData.street}
								placeholder="House number, street name (optional)"
								class={form?.errors?.street ? "border-red-500" : ""}
							/>
							{#if form?.errors?.street}
								<p class="text-sm text-red-600">{form.errors.street[0]}</p>
							{/if}
						</div>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="space-y-2">
								<Label for="barangay">Barangay *</Label>
								<Input
									id="barangay"
									name="barangay"
									type="text"
									bind:value={formData.barangay}
									placeholder="Enter barangay"
									class={form?.errors?.barangay ? "border-red-500" : ""}
									required
								/>
								{#if form?.errors?.barangay}
									<p class="text-sm text-red-600">{form.errors.barangay[0]}</p>
								{/if}
							</div>

							<div class="space-y-2">
								<Label for="city">City *</Label>
								<Input
									id="city"
									name="city"
									type="text"
									bind:value={formData.city}
									placeholder="Enter city"
									class={form?.errors?.city ? "border-red-500" : ""}
									required
								/>
								{#if form?.errors?.city}
									<p class="text-sm text-red-600">{form.errors.city[0]}</p>
								{/if}
							</div>
						</div>

						<div class="space-y-2">
							<Label for="province">Province *</Label>
							<select
								id="province"
								name="province"
								bind:value={formData.province}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none {form
									?.errors?.province
									? 'border-red-500'
									: ''}"
								required
							>
								<option value="">Select a province</option>
								{#each philippineProvinces as province}
									<option value={province}>{province}</option>
								{/each}
							</select>
							{#if form?.errors?.province}
								<p class="text-sm text-red-600">{form.errors.province[0]}</p>
							{/if}
						</div>
					</div>

					{#if form?.message}
						<div class="rounded-md bg-red-50 p-4">
							<div class="flex">
								<div class="flex-shrink-0">
									<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class="ml-3">
									<p class="text-sm text-red-800">{form.message}</p>
								</div>
							</div>
						</div>
					{/if}

					<Button type="submit" class="w-full" disabled={loading}>
						{#if loading}
							<svg
								class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Creating Account...
						{:else}
							Create Account
						{/if}
					</Button>
				</form>

				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="bg-white px-2 text-gray-500">Or sign up with</span>
						</div>
					</div>

					<div class="mt-6">
						<Button type="button" variant="outline" class="w-full" href="/login/google">
							<svg class="mr-3 h-5 w-5" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Sign up with Google
						</Button>
					</div>
				</div>

				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Already have an account?
						<a href="/login" class="font-medium text-primary hover:underline"> Sign in here </a>
					</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>

<style>
	/* Custom styles for better mobile responsiveness */
	@media (max-width: 768px) {
		.grid-cols-1.md\:grid-cols-2 {
			grid-template-columns: 1fr;
		}
	}
</style>

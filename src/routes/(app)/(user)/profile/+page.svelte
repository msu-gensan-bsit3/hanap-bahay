<script lang="ts">
	import { Avatar } from "$lib/components/ui/avatar";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Separator } from "$lib/components/ui/separator";
	import { Calendar, Edit, Mail, MapPin, Phone, Save, User, X } from "@lucide/svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let { user } = data;

	let isEditing = $state(false);
	let isSaving = $state(false);
	let editForm = $state({
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		mobileNumber: user.mobileNumber,
		street: user.address?.street || "",
		barangay: user.address?.barangay || "",
		city: user.address?.city || "",
		province: user.address?.province || "",
	});

	function toggleEdit() {
		if (isEditing) {
			// Reset form if canceling
			editForm = {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				mobileNumber: user.mobileNumber,
				street: user.address?.street || "",
				barangay: user.address?.barangay || "",
				city: user.address?.city || "",
				province: user.address?.province || "",
			};
		}
		isEditing = !isEditing;
	}

	async function handleSave() {
		isSaving = true;
		try {
			// TODO: Implement save functionality
			console.log("Saving profile changes:", editForm);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			isEditing = false;
		} catch (error) {
			console.error("Error saving profile:", error);
		} finally {
			isSaving = false;
		}
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	}

	function getFullAddress() {
		const address = user.address;
		if (!address) return "No address provided";

		const parts = [address.street, address.barangay, address.city, address.province];
		return parts.filter(Boolean).join(", ");
	}

	function getUserInitials() {
		return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
	}
</script>

<svelte:head>
	<title>My Profile - JuanHomes</title>
</svelte:head>

<div class="container mx-auto max-w-6xl p-6">
	<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight">My Profile</h1>
			<p class="text-muted-foreground">Manage your personal information and account settings</p>
		</div>

		<div class="flex gap-3">
			{#if isEditing}
				<Button
					variant="outline"
					onclick={toggleEdit}
					class="transition-all hover:scale-105"
					disabled={isSaving}
				>
					<X class="mr-2 h-4 w-4" />
					Cancel
				</Button>
				<Button onclick={handleSave} class="transition-all hover:scale-105" disabled={isSaving}>
					{#if isSaving}
						<div
							class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
						></div>
						Saving...
					{:else}
						<Save class="mr-2 h-4 w-4" />
						Save Changes
					{/if}
				</Button>
			{:else}
				<Button variant="outline" onclick={toggleEdit} class="transition-all hover:scale-105">
					<Edit class="mr-2 h-4 w-4" />
					Edit Profile
				</Button>
			{/if}
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Profile Overview Card -->
		<div class="lg:col-span-1">
			<Card class="relative overflow-hidden py-0 transition-all duration-300 hover:shadow-lg">
				<!-- Header gradient background -->
				<div class="h-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"></div>

				<div class="relative -mt-12 flex flex-col items-center px-6 pb-6 text-center">
					<!-- Profile Avatar with improved styling -->
					<div class="group relative">
						<Avatar
							class="h-24 w-24 border-4 border-background shadow-lg transition-transform duration-300 group-hover:scale-105"
						>
							{#if user.profilePicture}
								<img
									src={user.profilePicture}
									alt="Profile"
									class="h-full w-full object-cover"
									referrerpolicy="no-referrer"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-primary-foreground"
								>
									{getUserInitials()}
								</div>
							{/if}
						</Avatar>
						<!-- Online status indicator -->
						<div
							class="absolute -right-1 -bottom-1 h-6 w-6 animate-pulse rounded-full border-2 border-background bg-green-500"
						></div>
					</div>

					<div class="mt-4 w-full space-y-3">
						<div>
							<h2 class="text-xl font-bold">{user.firstName} {user.lastName}</h2>
							<p class="text-sm text-muted-foreground">@{user.username}</p>
						</div>

						<Badge variant={user.status === "ACTIVE" ? "default" : "secondary"} class="px-3 py-1">
							{user.status}
						</Badge>
					</div>

					<!-- Contact Information with improved spacing -->
					<div class="mt-6 w-full space-y-4">
						<div class="space-y-3 text-sm">
							<div
								class="flex items-center gap-3 rounded-lg bg-muted/30 p-3 transition-all duration-200 hover:scale-[1.02] hover:bg-muted/50"
							>
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<Mail class="h-4 w-4 text-primary" />
								</div>
								<span class="flex-1 truncate text-left">{user.email}</span>
							</div>

							<div
								class="flex items-center gap-3 rounded-lg bg-muted/30 p-3 transition-all duration-200 hover:scale-[1.02] hover:bg-muted/50"
							>
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<Phone class="h-4 w-4 text-primary" />
								</div>
								<span class="flex-1 text-left">{user.mobileNumber}</span>
							</div>

							<div
								class="flex items-center gap-3 rounded-lg bg-muted/30 p-3 transition-all duration-200 hover:scale-[1.02] hover:bg-muted/50"
							>
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<Calendar class="h-4 w-4 text-primary" />
								</div>
								<span class="flex-1 text-left">Born {formatDate(user.birthDate)}</span>
							</div>

							<div
								class="flex items-start gap-3 rounded-lg bg-muted/30 p-3 transition-all duration-200 hover:scale-[1.02] hover:bg-muted/50"
							>
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
									<MapPin class="h-4 w-4 text-primary" />
								</div>
								<span class="flex-1 text-left leading-relaxed">{getFullAddress()}</span>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Profile Details Card -->
		<div class="lg:col-span-2">
			<Card class="overflow-hidden py-0 transition-all duration-300 hover:shadow-lg">
				<div class="border-b bg-muted/30 px-6 py-4">
					<h3 class="text-lg font-semibold">Profile Information</h3>
					<p class="text-sm text-muted-foreground">
						{isEditing
							? "Update your personal information below"
							: "Your personal information and contact details"}
					</p>
				</div>

				<div class="p-6">
					<div class="space-y-8 transition-all duration-300">
						<!-- Personal Information Section -->
						<div
							class="space-y-4 transition-all duration-300 {isEditing
								? 'animate-pulse-subtle'
								: ''}"
						>
							<h4 class="flex items-center gap-2 text-base font-semibold text-foreground">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200"
								>
									<User class="h-4 w-4 text-primary" />
								</div>
								Personal Information
							</h4>

							<div class="grid gap-6 sm:grid-cols-2">
								<div class="space-y-2">
									<Label for="firstName" class="text-sm font-medium">First Name</Label>
									{#if isEditing}
										<Input
											id="firstName"
											bind:value={editForm.firstName}
											placeholder="Enter first name"
											class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
										/>
									{:else}
										<div
											class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
										>
											{user.firstName}
										</div>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="lastName" class="text-sm font-medium">Last Name</Label>
									{#if isEditing}
										<Input
											id="lastName"
											bind:value={editForm.lastName}
											placeholder="Enter last name"
											class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
										/>
									{:else}
										<div
											class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
										>
											{user.lastName}
										</div>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="username" class="text-sm font-medium">Username</Label>
									<div class="relative">
										<div class="rounded-lg border bg-muted/50 px-4 py-3 text-sm">
											@{user.username}
										</div>
										<Badge variant="outline" class="absolute -top-2 right-2 bg-background text-xs">
											Fixed
										</Badge>
									</div>
									<p class="text-xs text-muted-foreground">Username cannot be changed</p>
								</div>

								<div class="space-y-2">
									<Label for="birthDate" class="text-sm font-medium">Birth Date</Label>
									<div class="relative">
										<div class="rounded-lg border bg-muted/50 px-4 py-3 text-sm">
											{formatDate(user.birthDate)}
										</div>
										<Badge variant="outline" class="absolute -top-2 right-2 bg-background text-xs">
											Fixed
										</Badge>
									</div>
									<p class="text-xs text-muted-foreground">Birth date cannot be changed</p>
								</div>
							</div>
						</div>

						<Separator />

						<!-- Contact Information Section -->
						<div class="space-y-4">
							<h4 class="flex items-center gap-2 text-base font-semibold text-foreground">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
									<Mail class="h-4 w-4 text-primary" />
								</div>
								Contact Information
							</h4>

							<div class="grid gap-6 sm:grid-cols-2">
								<div class="space-y-2">
									<Label for="email" class="text-sm font-medium">Email Address</Label>
									{#if isEditing}
										<Input
											id="email"
											type="email"
											bind:value={editForm.email}
											placeholder="Enter email address"
											class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
										/>
									{:else}
										<div
											class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
										>
											{user.email}
										</div>
									{/if}
								</div>

								<div class="space-y-2">
									<Label for="mobileNumber" class="text-sm font-medium">Mobile Number</Label>
									{#if isEditing}
										<Input
											id="mobileNumber"
											bind:value={editForm.mobileNumber}
											placeholder="Enter mobile number"
											class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
										/>
									{:else}
										<div
											class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
										>
											{user.mobileNumber}
										</div>
									{/if}
								</div>
							</div>
						</div>

						<Separator />

						<!-- Address Information Section -->
						<div class="space-y-4">
							<h4 class="flex items-center gap-2 text-base font-semibold text-foreground">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
									<MapPin class="h-4 w-4 text-primary" />
								</div>
								Address Information
							</h4>

							<div class="grid gap-6">
								<div class="space-y-2">
									<Label for="street" class="text-sm font-medium">Street Address</Label>
									{#if isEditing}
										<Input
											id="street"
											bind:value={editForm.street}
											placeholder="Enter street address (optional)"
											class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
										/>
									{:else}
										<div
											class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
										>
											{user.address?.street || "Not provided"}
										</div>
									{/if}
								</div>

								<div class="grid gap-4 sm:grid-cols-3">
									<div class="space-y-2">
										<Label for="barangay" class="text-sm font-medium">Barangay</Label>
										{#if isEditing}
											<Input
												id="barangay"
												bind:value={editForm.barangay}
												placeholder="Enter barangay"
												class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
											/>
										{:else}
											<div
												class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
											>
												{user.address?.barangay}
											</div>
										{/if}
									</div>

									<div class="space-y-2">
										<Label for="city" class="text-sm font-medium">City</Label>
										{#if isEditing}
											<Input
												id="city"
												bind:value={editForm.city}
												placeholder="Enter city"
												class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
											/>
										{:else}
											<div
												class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
											>
												{user.address?.city}
											</div>
										{/if}
									</div>

									<div class="space-y-2">
										<Label for="province" class="text-sm font-medium">Province</Label>
										{#if isEditing}
											<Input
												id="province"
												bind:value={editForm.province}
												placeholder="Enter province"
												class="transition-all duration-200 focus:scale-[1.02] focus:ring-2 focus:ring-primary/20"
											/>
										{:else}
											<div
												class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
											>
												{user.address?.province}
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>

						<Separator />

						<!-- Account Information Section -->
						<div class="space-y-4">
							<h4 class="flex items-center gap-2 text-base font-semibold text-foreground">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
									<User class="h-4 w-4 text-primary" />
								</div>
								Account Information
							</h4>

							<div class="grid gap-6 sm:grid-cols-2">
								<!-- <div class="space-y-2">
									<Label class="text-sm font-medium">Account Status</Label>
									<div class="flex items-center gap-2">
										<Badge
											variant={user.status === "ACTIVE" ? "sale" : "secondary"}
											class="px-3 py-1 text-xs font-medium"
										>
											{user.status}
										</Badge>
										{#if user.status === "ACTIVE"}
											<span class="text-xs text-green-600">● All systems operational</span>
										{/if}
									</div>
								</div> -->

								<div class="space-y-2">
									<Label class="text-sm font-medium">Member Since</Label>
									<div
										class="rounded-lg border bg-muted/30 px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.01] hover:bg-muted/50"
									>
										{formatDate(user.dateCreated)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>

<style>
	@keyframes pulse-subtle {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.95;
		}
	}

	.animate-pulse-subtle {
		animation: pulse-subtle 2s ease-in-out infinite;
	}
</style>

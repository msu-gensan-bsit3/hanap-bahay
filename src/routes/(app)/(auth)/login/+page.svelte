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
	import { heights } from "$lib/states/heights.svelte";
	import type { PageData } from "./$types";

	let { data, form }: { data: PageData; form: any } = $props();

	let loading = $state(false);
	let identifier = $state(form?.data?.identifier || "");
	let password = $state("");
</script>

<svelte:head>
	<title>Login - JuanHome</title>
</svelte:head>

<div
	class="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
	style="margin-top: -{heights.header}px;"
>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-gray-900">Welcome back</h1>
			<p class="mt-2 text-sm text-gray-600">Sign in to your JuanHome account</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>Enter your credentials to access your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					method="POST"
					action="?/login"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
					class="space-y-6"
				>
					<div class="space-y-2">
						<Label for="identifier">Email or Username</Label>
						<Input
							id="identifier"
							name="identifier"
							type="text"
							autocomplete="email"
							bind:value={identifier}
							placeholder="Enter your email or username"
							class={form?.errors?.identifier ? "border-red-500" : ""}
							required
						/>
						{#if form?.errors?.identifier}
							<p class="text-sm text-red-600">{form.errors.identifier[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							bind:value={password}
							placeholder="Enter your password"
							class={form?.errors?.password ? "border-red-500" : ""}
							required
						/>
						{#if form?.errors?.password}
							<p class="text-sm text-red-600">{form.errors.password[0]}</p>
						{/if}
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
							Signing in...
						{:else}
							Sign In
						{/if}
					</Button>
				</form>

				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="bg-white px-2 text-gray-500">Or continue with</span>
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
							Continue with Google
						</Button>
					</div>
				</div>

				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Don't have an account?
						<a href="/register" class="font-medium text-primary hover:underline">
							Create one here
						</a>
					</p>
				</div>

				<div class="mt-4 text-center">
					<a href="/forgot-password" class="text-sm text-gray-600 hover:underline">
						Forgot your password?
					</a>
				</div>
			</CardContent>
		</Card>
	</div>
</div>

<style>
	/* Additional custom styles if needed */
</style>

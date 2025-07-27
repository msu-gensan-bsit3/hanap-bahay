<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form: any } = $props();

  let loading = $state(false);
  let identifier = $state(form?.data?.identifier || '');
  let password = $state('');
</script>

<svelte:head>
  <title>Login - JuanHome</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
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
              class={form?.errors?.identifier ? 'border-red-500' : ''}
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
              class={form?.errors?.password ? 'border-red-500' : ''}
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
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{form.message}</p>
                </div>
              </div>
            </div>
          {/if}

          <Button 
            type="submit" 
            class="w-full" 
            disabled={loading}
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            {:else}
              Sign In
            {/if}
          </Button>
        </form>

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

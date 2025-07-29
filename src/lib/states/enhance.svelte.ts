import { enhance as defaultEnhance } from "$app/forms";
// import { toasts } from './toast.svelte';

interface options {
	onSubmit?: (fd: FormData) => void;
	onSubmitted?: (res: Record<string, unknown> | undefined) => void | boolean;
	onFailure?: (err: string) => void;
	reset?: boolean;
}

export class MoreEnhance {
	submitting = $state(false);
	success = $state(false);
	opts?: options;

	constructor(opts?: options) {
		this.opts = opts;

		this.enhance = this.enhance.bind(this);
	}

	enhance(el: HTMLFormElement) {
		defaultEnhance(el, ({ cancel }) => {
			this.submitting = true;

			// Return true to cancel
			if (this.opts?.onSubmit?.(new FormData(el))) {
				this.submitting = false;
				cancel();
			}

			return ({ result, update }) => {
				if (result.type === "success") {
					this.success = true;
					this.opts?.onSubmitted?.(result.data);
				} else if (result.type === "failure") {
					if (result.data?.error) {
						const error = result.data.error as string;
						this.opts?.onFailure?.(error);
						// toasts.error(error);
					}
				}
				this.submitting = false;

				update({ reset: this.opts?.reset });
			};
		});
	}
}

export function moreEnhance(opts?: options) {
	return new MoreEnhance(opts);
}

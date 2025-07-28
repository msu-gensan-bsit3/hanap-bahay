import type { Unsafe } from "sveltekit-sse";

export type emitter = (eventName: string, data: string) => Unsafe<void, Error>;

type emitterObj = Record<string, emitter>;
export class ServerEvents {
	#emitters: emitterObj;
	#name: string;
	#counter: number;
	constructor(name: string) {
		this.#name = name;
		this.#counter = 0;
		this.#emitters = {};
	}

	setEventEmitter(id: string | undefined, emitter: emitter) {
		if (id) {
			this.#emitters[id] = emitter;
		}
		// console.log(Object.values(this.emitters).length);
	}
	removeEventEmitter(id: string | undefined) {
		if (id) {
			delete this.#emitters[id];
		}
		// console.log(Object.values(this.#emitters).length);
	}
	emitEvent() {
		Object.values(this.#emitters).forEach((v) => {
			this.#counter = (this.#counter + 1) % 10;
			v(this.#name, String(this.#counter));
		});
	}
}

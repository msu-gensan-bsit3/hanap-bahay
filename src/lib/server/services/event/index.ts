import { ServerEvents, type emitter } from "./sse";

class EventSubscribe {
	private subscription: Record<string, ServerEvents> = {};

	constructor(private namespace: string) {}

	subscribe(groupId: string, id: string, emitter: emitter) {
		if (!this.subscription[groupId]) {
			this.subscription[groupId] = new ServerEvents(`${this.namespace}-${groupId}`);
		}

		this.subscription[groupId].setEventEmitter(`${groupId}-${id}`, emitter);
	}

	unsubscribe(groupId: string, id: string) {
		this.subscription[groupId]?.removeEventEmitter(`${groupId}-${id}`);
	}

	emitEvent(groupId: string) {
		this.subscription[groupId]?.emitEvent();
	}
}

export const messageSubscription = new EventSubscribe("messaging");
// export const messagingEvents = new ServerEvents("messaging");

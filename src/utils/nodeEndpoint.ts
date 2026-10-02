/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from "comlink";
import { Worker } from "worker_threads";

export function nodeEndpoint(nodeWorker: Worker): Endpoint {
	const listeners = new WeakMap<EventListenerOrEventListenerObject, (data: any) => void>();

	return {
		postMessage: (msg: any, transfer?: Transferable[]) => {
			nodeWorker.postMessage(msg, transfer as any);
		},
		addEventListener: (_, handler) => {
			const listener = (data: any) => {
				if ("handleEvent" in handler) {
					handler.handleEvent({ data } as any);
				} else {
					handler({ data } as any);
				}
			};
			nodeWorker.on("message", listener);
			listeners.set(handler, listener);
		},
		removeEventListener: (_, handler) => {
			const listener = listeners.get(handler);
			if (!listener) return;
			nodeWorker.off("message", listener);
			listeners.delete(handler);
		},
		start: (nodeWorker as any).start?.bind(nodeWorker),
	};
}

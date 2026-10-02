export interface SignalConnection {
	remove(): void;
}

export class Signal<T> {
	private listeners = new Set<(data: T) => void>();
	private tmpListeners = new Set<(data: T) => void>();

	public add(cb: (data: T) => void): SignalConnection {
		this.listeners.add(cb);
		return {
			remove: () => {
				this.listeners.delete(cb);
			},
		};
	}

	public once(cb: (data: T) => void) {
		this.tmpListeners.add(cb);
	}

	public emit(data: T): void {
		this.listeners.forEach((cb) => cb(data));
		this.tmpListeners.forEach((cb) => {
			cb(data);
			this.tmpListeners.delete(cb);
		});
	}
}

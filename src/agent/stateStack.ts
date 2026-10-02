import { AgentState } from "./state.js";
import { Signal } from "../types/signal.js";

export class StateStack {
	private currentId = 0;

	private stack: Array<{
		state: AgentState;
		id: number;
	}> = [];

	public readonly stateSignal = new Signal<AgentState>();
	public readonly finishedStateSignal = new Signal<number>();

	constructor() {
		this.stack.push({ state: { type: "idle" }, id: this.currentId++ });
	}

	public newState(state: AgentState): number {
		const id = this.currentId++;
		this.stack.push({ state, id });
		this.stateSignal.emit(state);
		return id;
	}

	public finishedState(): void {
		const finished = this.stack.pop();
		if (finished) {
			this.finishedStateSignal.emit(finished.id);
		}
		const prevState = this.stack.pop();
		if (prevState) {
			this.stack.push(prevState);
		} else {
			const idleState: AgentState = { type: "idle" };
			this.stack.push({ state: idleState, id: this.currentId++ });
			this.stateSignal.emit(idleState);
		}
	}

	public waitForState(id: number): Promise<void> {
		return new Promise((resolve) => {
			const signal = this.finishedStateSignal.add((finishedId) => {
				if (finishedId === id) {
					signal.remove();
					resolve();
				}
			});
		});
	}

	public waitForIdle(): Promise<void> {
		return new Promise((resolve) => {
			if (this.current.type === "idle") {
				resolve();
				return;
			}
			const signal = this.stateSignal.add((state) => {
				if (state.type === "idle") {
					signal.remove();
					resolve();
				}
			});
		});
	}

	public get current(): AgentState {
		return this.stack[this.stack.length - 1]?.state ?? { type: "idle" };
	}
}

import { AgentState } from "./state.js";
import { Signal } from "../types/signal.js";

export class StateStack {
	private stack: AgentState[] = [];
	public readonly stateSignal = new Signal<AgentState>();

	constructor() {
		this.stack.push({ type: "idle" });
	}

	public newState(state: AgentState): void {
		this.stack.push(state);
		this.stateSignal.emit(state);
	}

	public finishedState(): void {
		this.stack.pop();
		const prevState = this.stack.pop();
		if (prevState) {
			this.stack.push(prevState);
			this.stateSignal.emit(prevState);
		} else {
			const idleState: AgentState = { type: "idle" };
			this.stack.push(idleState);
			this.stateSignal.emit(idleState);
		}
	}

	public get current(): AgentState {
		return this.stack[this.stack.length - 1] ?? { type: "idle" };
	}
}

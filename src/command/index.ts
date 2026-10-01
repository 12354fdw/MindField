import { CommandBuilder, CommandDispatcher } from "@12354fdw/lcmd";
import { CommandContext } from "./context.js";
import pathfinder from "mineflayer-pathfinder";

export class CommandManager {
	public readonly dispatcher: CommandDispatcher<CommandContext>;

	constructor() {
		this.dispatcher = new CommandDispatcher<CommandContext>();

		//

		this.dispatcher.register(
			new CommandBuilder<CommandContext>()
				.name("GOTO")
				.parameter("x", "number")
				.parameter("y", "number")
				.parameter("z", "number")
				.handler((ctx, { x, y, z }) => {
					const bot = ctx.agent.bot;

					const goal = new pathfinder.goals.GoalBlock(x, y, z);
					bot.whisper(ctx.source, `Going to ${x}, ${y}, ${z}`);
					bot.pathfinder.goto(goal);
				})
				.build(),
		);
	}

	public runCommand(cmdString: string, ctx: CommandContext) {
		console.log(cmdString);
		try {
			this.dispatcher.execute(cmdString, ctx);
		} catch (raw: unknown) {
			const error = raw as Error;
			ctx.agent.bot.whisper(ctx.source, `ERROR: ${error.message}`);
		}
	}
}

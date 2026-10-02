import { CommandBuilder, CommandDispatcher } from "@12354fdw/lcmd";
import { CommandContext } from "./context.js";
import pathfinder from "mineflayer-pathfinder";
import { MiningPlanner } from "../orchestration/mining/miningPlanner.js";
import { Vec3 } from "vec3";

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
					ctx.agent.goto(goal);
				})
				.build(),
		);

		this.dispatcher.register(
			new CommandBuilder<CommandContext>()
				.name("STOPWALK")
				.handler((ctx) => {
					const bot = ctx.agent.bot;
					ctx.agent.stopWalking();
					bot.whisper(ctx.source, `Stopped walking.`);
				})
				.build(),
		);

		this.dispatcher.register(
			new CommandBuilder<CommandContext>()
				.name("MINEAREA")
				.parameter("ax", "number")
				.parameter("ay", "number")
				.parameter("az", "number")
				.parameter("bx", "number")
				.parameter("by", "number")
				.parameter("bz", "number")
				.handler(async (ctx, args) => {
					const manager = new MiningPlanner(
						new Vec3(args.ax, args.ay, args.az),
						new Vec3(args.bx, args.by, args.bz),
					);

					for (const spec of manager.chunks) {
						await ctx.agent.bot.building.mineChunk(spec);
					}
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

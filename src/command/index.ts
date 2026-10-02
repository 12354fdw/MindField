import { CommandBuilder, CommandDispatcher } from "@12354fdw/lcmd";
import { CommandContext } from "./context.js";
import { Vec3 } from "vec3";
import { OrchestratedMiningAction } from "../orchestration/actions/mine.js";

export class CommandManager {
	public readonly dispatcher: CommandDispatcher<CommandContext>;

	constructor() {
		this.dispatcher = new CommandDispatcher<CommandContext>();

		//
		this.dispatcher.register(
			new CommandBuilder<CommandContext>()
				.name("MINEAREA")
				.parameter("botcount", "number")
				.parameter("ax", "number")
				.parameter("ay", "number")
				.parameter("az", "number")
				.parameter("bx", "number")
				.parameter("by", "number")
				.parameter("bz", "number")
				.handler(async (ctx, args) => {
					const agents = ctx.agentManager.getIdleAgents(args.botcount);
					const action = new OrchestratedMiningAction(agents, ctx.agentManager);

					console.log(
						`Mining Area (${args.ax}, ${args.ay}, ${args.az}) to (${args.bx}, ${args.by}, ${args.bz})`,
					);

					await action.execute({
						a: new Vec3(args.ax, args.ay, args.az),
						b: new Vec3(args.bx, args.by, args.bz),
					});
				})
				.build(),
		);
	}

	public runCommand(cmdString: string, ctx: CommandContext) {
		try {
			this.dispatcher.execute(cmdString, ctx);
		} catch (raw: unknown) {
			const error = raw as Error;
			console.log(`ERROR: ${error.message}`);
		}
	}
}

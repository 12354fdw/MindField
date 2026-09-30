interface AutoAuthOptions {
	password: string;
	logging?: boolean;
	ignoreRepeat?: boolean;
	repeatCb?: () => void;
}

declare module "mineflayer-auto-auth" {
	import type { Bot, BotOptions } from "mineflayer";

	const autoAuth: (bot: Bot, options: BotOptions & { AutoAuth?: AutoAuthOptions | string }) => void;

	export default autoAuth;
}

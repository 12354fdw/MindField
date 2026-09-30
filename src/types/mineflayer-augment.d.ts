import "mineflayer";

declare global {
	interface AutoAuthOptions {
		password: string;
		logging?: boolean;
		ignoreRepeat?: boolean;
		repeatCb?: () => void;
	}
}

declare module "mineflayer" {
	interface BotOptions {
		AutoAuth?: AutoAuthOptions | string;
	}

	interface BotEvents {
		serverAuth: () => void;
	}
}

export {};

export const SECRETS = {
	server: process.env.SERVER_ADDRESS as string,
	passwd: process.env.PASSWD as string,
	agentCount: parseInt(process.env.AGENT_COUNT || "5"),
};

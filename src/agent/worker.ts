import { expose } from "comlink";
import { AgentWorker } from "./agentWorker.js";
import { parentPort, workerData } from "worker_threads";

const { host, username, passwd } = workerData;

const agent = new AgentWorker(host, username, passwd);

expose(agent, parentPort!);

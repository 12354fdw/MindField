import { expose } from "comlink";
import { AgentWorker } from "./agent.js";
import { workerData } from "worker_threads";

const { host, username, passwd } = workerData;

const agent = new AgentWorker(host, username, passwd);

expose(agent);

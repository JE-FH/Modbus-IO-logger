import { IPLCCommunicator } from "./IPLCCommunicator";

export interface IAction {
    Describe(): string;
    readonly Name: string;
    Execute(communicator: IPLCCommunicator): Promise<void>;
}

export interface IActionGenerator {
    GenerateRun(actionCount: number): Array<IAction>;
}

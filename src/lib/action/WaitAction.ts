import { IAction } from "../IActionGenerator";
import { IPLCCommunicator } from "../IPLCCommunicator";

export class WaitAction implements IAction {
    constructor() {

    }
    Describe(): string {
        return "Wait()";
    }
    
    readonly Name: string = "Wait";

    async Execute(communicator: IPLCCommunicator): Promise<void> {
        return;
    }
    
}
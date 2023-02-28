import { IAction } from "../IActionGenerator";
import { IPLCCommunicator } from "../IPLCCommunicator";

class ChangeInputAction implements IAction {
    readonly Name: string;
    constructor() {
        this.Name = "ChangeInput";
    }

    Describe(): string {
        throw new Error("Ding dong");
    }

    Execute(communicator: IPLCCommunicator): Promise<void> {
        throw new Error("binggpt")
    }
}
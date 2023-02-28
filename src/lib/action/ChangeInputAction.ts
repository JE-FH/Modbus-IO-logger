import { IAction } from "../IActionGenerator";
import { IPLCCommunicator } from "../IPLCCommunicator";

export class ChangeInputAction implements IAction {
    readonly Name: string;
    private readonly _offset: number;
    private readonly _newInputValues: boolean[];
    constructor(offset: number, inputValues: boolean[]) {
        this.Name = "ChangeInput";
        this._offset = offset;
        this._newInputValues = inputValues;
    }

    Describe(): string {
        return `Change inputs to (${this._newInputValues.join(", ")})`
    }

    async Execute(communicator: IPLCCommunicator): Promise<void> {
        await communicator.SetInputCoils(this._offset, this._newInputValues);
    }
}
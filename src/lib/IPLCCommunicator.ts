export interface IPLCCommunicator {
    SetInputCoils(offset: number, values: Array<boolean>): Promise<void>;
    GetOutputCoils(offset: number, amount: number): Promise<Array<boolean>>;
    GetInputCoils(offset: number, amount: number): Promise<Array<boolean>>;
    Reset(): Promise<void>;
}
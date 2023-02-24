interface IPLCCommunicator {
    SetCoilBytes(offset: number, values: Array<0 | 1>): Promise<void>;
    GetCoilBytes(offset: number): Promise<Array<0 | 1>>;
}
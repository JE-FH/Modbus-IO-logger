import { Config } from "./IConfigManager";

class ModbusPLCCommunicator implements IPLCCommunicator {
    constructor(config: Config) {
        
    }
    
    SetCoilBytes(offset: number, values: (0 | 1)[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    GetCoilBytes(offset: number): Promise<(0 | 1)[]> {
        throw new Error("Method not implemented.");
    }
}
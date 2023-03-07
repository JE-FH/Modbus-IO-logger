import { BajerConfig } from "./BajerConfig";

export interface Config {
    ModbusMasterServer: {
        host: string;
        port: number;
    };
    ModbusDevice: {
        hostIp: string;
        port: number;
        inputOffset: number;
        inputSize: number;
        outputOffset: number;
        outputSize: number;
        slaveId: number;
    },
    actionsPerRun: number;
    numberOfRuns: number;
    actionDelay: { // in milliseconds
        minimum: number;
        maximum: number;
    },
    openPlcApiPath: string;
    outputFilePath: string;
}

export interface IConfigManager {
    LoadConfig(): Promise<Config>;
    LoadBajerConfig(): Promise<BajerConfig>;
    WriteConfig(config: Config): Promise<void>;
}

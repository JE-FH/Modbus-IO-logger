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
        slaveId: number;
    },
    //Polling rate is the amount of polls per second
    pollingRate: number;
    actionsPerRun: number;
    numberOfRuns: number;
    actionDelay: { // in milliseconds
        minimum: number;
        maximum: number;
    },
    outputFilePath: string;
}

export interface IConfigManager {
    LoadConfig(): Promise<Config>;
    WriteConfig(config: Config): Promise<void>;
}

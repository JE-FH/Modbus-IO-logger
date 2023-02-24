import { FileConfigManager } from "./lib/FileConfigManager";
import { IConfigManager } from "./lib/IConfigManager";

async function main() {
    let configManager: IConfigManager = new FileConfigManager();

    await configManager.WriteConfig({
        ModbusMasterServer: {
            host: "127.0.0.1",
            port: 502
        },
        ModbusDevice: {
            hostIp: "127.0.0.1",
            port: 503,
            inputOffset: 0,
            inputSize: 16,
            slaveId: 1
        },
        pollingRate: 50,
        actionsPerRun: 150,
        numberOfRuns: 100,
        actionDelay: {
            minimum: 50,
            maximum: 150,
        },
        outputFilePath: "run.tsv"
    });

    console.log("Successfully wrote default config");
}

main();
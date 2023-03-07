import * as modbus from "jsmodbus";
import { config } from "process";
import { FileConfigManager } from "./lib/FileConfigManager";
import { ModbusLoggerRunner } from "./lib/ModbusLoggerRunner";
import { ModbusPLCCommunicator } from "./lib/ModbusPLCCommunicator";
import { RandomActionGenerator } from "./lib/RandomActionGenerator";
import { CSVOutputLogger } from "./lib/CSVOutputLogger";
import { ModbusBajerRunner } from "./lib/ModbusBajerRunner";
import { BajerTCPServer } from "./lib/BajerTCPServer";

async function main() {
    let configManager = new FileConfigManager();
    let config = await configManager.LoadConfig();
    let bajerConfig = await configManager.LoadBajerConfig();
    let modbusBajerRunner = new ModbusBajerRunner(
        new ModbusPLCCommunicator(config),
        new BajerTCPServer(bajerConfig.host, bajerConfig.port), 
    );

    await modbusBajerRunner.Run();
}

main();
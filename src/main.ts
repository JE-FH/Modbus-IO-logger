import * as modbus from "jsmodbus";
import { config } from "process";
import { FileConfigManager } from "./lib/FileConfigManager";
import { ModbusLoggerRunner } from "./lib/ModbusLoggerRunner";
import { ModbusPLCCommunicator } from "./lib/ModbusPLCCommunicator";
import { RandomActionGenerator } from "./lib/RandomActionGenerator";
import { TSVOutputLogger } from "./lib/TSVOutputLogger";

async function main() {
    let configManager = new FileConfigManager();
    let config = await configManager.LoadConfig();
    let outputLogger = await TSVOutputLogger.FromConfig(config);
    let modbusLoggerRunner = new ModbusLoggerRunner(
        config, 
        outputLogger, 
        new RandomActionGenerator(), 
        new ModbusPLCCommunicator(config)
    );

    await modbusLoggerRunner.Run();
}

main();
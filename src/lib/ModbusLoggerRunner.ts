import { randomInt } from "crypto";
import { IAction, IActionGenerator } from "./IActionGenerator";
import { Config } from "./IConfigManager";
import { IOutputLogger } from "./IOutputLogger";
import { IPLCCommunicator } from "./IPLCCommunicator";

export class ModbusLoggerRunner {
    private readonly _outputLogger: IOutputLogger;
    private readonly _actionGenerator: IActionGenerator;
    private readonly _config: Config;
    private readonly _plcCommunicator: IPLCCommunicator;
    constructor(config: Config, outputLogger: IOutputLogger, actionGenerator: IActionGenerator, plcCommunicator: IPLCCommunicator) {
        this._outputLogger = outputLogger;
        this._config = config;
        this._actionGenerator = actionGenerator;
        this._plcCommunicator = plcCommunicator;
    }

    async Run(): Promise<void> {
        await this.WriteHeader();
        for (let runsDone = 0; runsDone < this._config.numberOfRuns; runsDone++) {
            let runActions = this._actionGenerator.GenerateRun(this._config.actionsPerRun);
            await this.RunRun(runActions)
        }
    }

    private async WriteHeader() {
        let inputNames = [];
        let outputNames = [];
        for (let i = 0; i < this._config.ModbusDevice.inputSize; i++) {
            inputNames.push("I" + i);
        }
        for (let i = 0; i < this._config.ModbusDevice.outputSize; i++) {
            outputNames.push("Q" + i);
        }
        await this._outputLogger.WriteHeader(inputNames, outputNames)
    }

    private async RunRun(actions: Array<IAction>): Promise<void> {
        await this._plcCommunicator.Reset();
        await this._outputLogger.BeginRun();
        for (let action of actions) {
            await this.LogState();
            await action.Execute(this._plcCommunicator);
            let waitTime = randomInt(this._config.actionDelay.minimum, this._config.actionDelay.maximum);
            await new Promise<void>((resolve) => setInterval(() => resolve(), waitTime));
        }
        await this._outputLogger.EndRun();
    }

    private async LogState() {
        let start = new Date();
        let [input, output] = await Promise.all([
            this._plcCommunicator.GetInputCoils(this._config.ModbusDevice.inputOffset, this._config.ModbusDevice.inputSize),
            this._plcCommunicator.GetOutputCoils(this._config.ModbusDevice.outputOffset, this._config.ModbusDevice.outputSize)
        ]);
        await this._outputLogger.LogState(start, input, output);
    }
}
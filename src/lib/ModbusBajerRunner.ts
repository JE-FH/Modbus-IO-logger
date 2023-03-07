import { Config } from "./IConfigManager";
import { IPLCCommunicator } from "./IPLCCommunicator";
import { Server as NetServer, Socket } from "net";
import { IBajerServer } from "./IBajerServer";

export class ModbusBajerRunner {
    private readonly _plcCommunicator: IPLCCommunicator;
    private readonly _bajerServer: IBajerServer;
    private _outputsToRead: number;
    constructor(plcCommunicator: IPLCCommunicator, bajerServer: IBajerServer) {
        this._plcCommunicator = plcCommunicator;
        this._bajerServer = bajerServer;
        this._outputsToRead = 0;
    }

    async Run(): Promise<void> {
        this._bajerServer.on("reset", (beo) => {
            beo.promise = (async () => {
                console.log("reset");
                await this._plcCommunicator.Reset();
            })();
        });
        
        this._bajerServer.on("setup", (inputCount, outputCount, beo) => {
            beo.promise = (async () => {
                console.log(`setup ${inputCount}, ${outputCount}`);

                this._outputsToRead = outputCount;
            })();
        });

        this._bajerServer.on("step", (inputs, beo) => {
            beo.promise = (async () => {
                console.log(`step ${inputs.map(v => v ? "1" : "0").join("")}`);
                await this._plcCommunicator.SetInputCoils(0, inputs);
                await new Promise<void>((resolve) => {
                    setTimeout(() => resolve(), 100);
                })
                return await this._plcCommunicator.GetOutputCoils(0, this._outputsToRead);
            })();
        });
        
        await this._bajerServer.Start();
    }
}
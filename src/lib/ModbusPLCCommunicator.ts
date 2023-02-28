import ModbusServer from "jsmodbus/dist/modbus-server";
import { Server as NetServer } from "net";
import { Config } from "./IConfigManager";
import * as Modbus from "jsmodbus";
import { IPLCCommunicator } from "./IPLCCommunicator";
import { BitStringAdapter } from "./BitStringAdapter";

export class ModbusPLCCommunicator implements IPLCCommunicator {
    private readonly _config: Config;
    private _modbusServer?: ModbusServer;
    private _netServer?: NetServer; 
    constructor(config: Config) {
        this._config = config;
        
        
    }

    async SetInputCoils(offset: number, values: boolean[]): Promise<void> {
        if (this._modbusServer == null)
            throw new Error("Modbus server not started");
        
        let adapter = new BitStringAdapter(this._modbusServer.discrete);
        adapter.SetBits(offset, values);
    }

    async GetOutputCoils(offset: number, amount: number): Promise<boolean[]> {
        if (this._modbusServer == null)
            throw new Error("Modbus server not started");
        
        let adapter = new BitStringAdapter(this._modbusServer.coils);
        return adapter.GetBits(offset, amount);
    }
    
    async GetInputCoils(offset: number, amount: number): Promise<boolean[]> {
        if (this._modbusServer == null)
            throw new Error("Modbus server not started");
        
        let adapter = new BitStringAdapter(this._modbusServer.discrete);
        return adapter.GetBits(offset, amount);

    }

    async Reset(): Promise<void> {
        await fetch(this._config.openPlcApiPath + "stop_plc");
        if (this._modbusServer != undefined) {
            this._modbusServer = undefined;
        }

        await new Promise<void>((resolve, reject) => {
            if (this._netServer == undefined) {
                resolve();
                return;
            }
            this._netServer.close((err) => {
                if (err) {
                    reject(err)
                    return; 
                }
                this._netServer = undefined;
                resolve();
            });
        });

        await fetch(this._config.openPlcApiPath + "start_plc");
        await this.initModbusServerAndWaitForConnection();
    }

    async initModbusServerAndWaitForConnection() {
        this._netServer = new NetServer();
        this._modbusServer = new Modbus.server.TCP(this._netServer);
        let connectionAwaiter = new Promise<void>((resolve, reject) => {
            if (this._modbusServer == null)
                throw new Error("Modbus server was not defined");
            
            this._modbusServer.once("connection", () => {
                resolve();
            });

            setTimeout(() => {
                reject(new Error("OpenPLC Runtime did not connect to modbus server"));
            }, 10000);
        });
        
        this._netServer.listen(this._config.ModbusDevice.port);
        await connectionAwaiter;
    }
}
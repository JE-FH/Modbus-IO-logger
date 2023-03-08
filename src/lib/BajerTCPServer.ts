import { EventEmitter } from "stream";
import { Server as NetServer, Socket } from "net";
import { BajerEventObject, IBajerServer } from "./IBajerServer";

function CopyOffset(buf: Buffer, offset: number): Buffer {
    let rv = Buffer.alloc(buf.length - offset);
    
    buf.copy(rv, 0, offset);
    return rv;
}

export class BajerTCPServer extends EventEmitter implements IBajerServer {
    private _netServer: NetServer; 
    private _client?: Socket;
    private _dataAccumulator: Buffer;
    private _inputSize: number;
    private _outputSize: number;
    private readonly _host: string;
    private readonly _port: number;
    private _runningCommands: boolean;

    constructor(host: string, port: number) {
        super();
        this._netServer = new NetServer();
        this._dataAccumulator = Buffer.alloc(0);
        this._inputSize = 0;
        this._outputSize = 0;
        this._host = host;
        this._port = port;
        this._runningCommands = false;
    }

    Stop(): void {
        if (this._netServer)
            this._netServer.close();
    }

    async Start(): Promise<void> {
        this._netServer = new NetServer();
        let closedAwaiter = new Promise<void>((resolve, reject) => {
            if (!this._netServer)
                reject(new Error("netserver not initialized"));
            this._netServer.on("close", () => {
                resolve();
            });
        });

        this._netServer.on("connection", (socket) => this.OnConnection(socket));

        this._netServer.listen(this._port, this._host)

        await closedAwaiter;

        this.emit("close");
    }

    private OnConnection(socket: Socket): void {
        if (this._client != null) {
            socket.destroy();
            console.warn("Client tried to connect while another client was already connect");
            return;
        }
        this._client = socket;
        this.SetupClient(this._client);
    }

    private SetupClient(socket: Socket): void {
        socket.on("close", () => {
            this._client = undefined;
        });
        socket.on("data", async (data) => {
            this._dataAccumulator = Buffer.concat([this._dataAccumulator, data]);
            if (!this._runningCommands)
                await this.RunFromAccumulator();
        });
    }

    private async RunFromAccumulator() {
        this._runningCommands = true;
        while (this._dataAccumulator.length > 0) {
            let commandByte = this._dataAccumulator.readInt8(0);
            if (commandByte == 0) {
                let bytesToRead = this._inputSize;
                if (this._dataAccumulator.length >= bytesToRead + 1) {
                    let commandBytes = this._dataAccumulator.subarray(1, bytesToRead + 1);
                    let bytes: boolean[] = [];

                    Uint8Array.from(commandBytes).forEach((x) => {
                        bytes.push(x == 0 ? false : true);
                    });

                    this._dataAccumulator = CopyOffset(this._dataAccumulator, bytesToRead + 1);

                    let beo = new BajerEventObject<Array<boolean>>(Promise.resolve([]));
                    this.emit("step", bytes, beo);
                    let data = await beo.wait();

                    if (this._client == null) {
                        console.warn("client disconnecting while responding");
                        return;
                    }

                    let responseBuffer = Buffer.alloc(this._outputSize + 1, 0);
                    responseBuffer.writeInt8(0);

                    for (let i = 0; i < data.length; i++) {
                        responseBuffer.writeInt8(data[i] ? 1 : 0, i + 1);
                    }

                    await this.WriteAndWait(responseBuffer);
                } else {
                    return;
                }
            } else if (commandByte == 1) {
                this._dataAccumulator = CopyOffset(this._dataAccumulator, 1);
                
                let beo = new BajerEventObject(Promise.resolve());
                this.emit("reset", beo);
                await beo.wait();

                if (this._client == null) {
                    throw new Error("client disconnected while writing response");
                }
                await this.WriteAndWait(Buffer.from(new Uint8Array([0])));
            } else if (commandByte == 2) {
                if (this._dataAccumulator.length >= 3) {
                    this._inputSize = this._dataAccumulator.readUint8(1);
                    this._outputSize = this._dataAccumulator.readUint8(2);
                    this._dataAccumulator = CopyOffset(this._dataAccumulator, 3);
                    
                    let beo = new BajerEventObject(Promise.resolve());
                    this.emit("setup", this._inputSize, this._outputSize, beo);
                    await beo.wait();

                    await this.WriteAndWait(Buffer.from(new Uint8Array([0])));
                } else {
                    return;
                }
            } else {
                this._dataAccumulator = CopyOffset(this._dataAccumulator, 1);
            }
        }
        this._runningCommands = false;
    }

    private async WriteAndWait(buffer: Buffer): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            if (this._client == null) {
                console.warn("client disconnecting while responding");
                return;
            }
            this._client.write(buffer, (err) => {  
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
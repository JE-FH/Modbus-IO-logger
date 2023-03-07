import { BajerTCPServer } from "./BajerTCPServer";
import * as Net from "net";
import { assert } from "chai";

describe("BajerTCPServer test", () => {
    it("Should receive setup command", async () => {
        let bajerTcpServer = new BajerTCPServer("127.0.0.1", 1340);
        bajerTcpServer.Start();
        
        let inputsReceived = 0;
        let outputsReceived = 0;

        bajerTcpServer.on("setup", (input, output, beo) => {
            inputsReceived = input;
            outputsReceived = output;
        })

        const client = new Net.Socket();
        await new Promise<void>((resolve) => {
            client.connect({
                host: "127.0.0.1",
                port: 1340
            }, () => resolve());
        });
        
        client.write(Buffer.from(Uint8Array.from([2, 155, 223])));
        
        let received_buffer = await new Promise<Buffer>((resolve, reject) => {
            client.once("data", (data) => {
                resolve(data);
            });
        });

        bajerTcpServer.Stop();
        assert.deepEqual(Uint8Array.from(received_buffer), Uint8Array.from([0]));
        assert.equal(inputsReceived, 155);
        assert.equal(outputsReceived, 223);
    });

    it("Should receive reset command", async () => {
        let bajerTcpServer = new BajerTCPServer("127.0.0.1", 1341);
        bajerTcpServer.Start();
        
        let reset = false;

        bajerTcpServer.on("reset", (beo) => {
            reset = true;
        })

        const client = new Net.Socket();
        await new Promise<void>((resolve) => {
            client.connect({
                host: "127.0.0.1",
                port: 1341
            }, () => resolve());
        });
        
        client.write(Buffer.from(Uint8Array.from([1])));
        
        let received_buffer = await new Promise<Buffer>((resolve, reject) => {
            client.once("data", (data) => {
                resolve(data);
            });
        });

        bajerTcpServer.Stop();
        assert.deepEqual(Uint8Array.from(received_buffer), Uint8Array.from([0]));
        assert.isTrue(reset);
    });

    it("Should receive step command", async () => {
        let bajerTcpServer = new BajerTCPServer("127.0.0.1", 1342);
        bajerTcpServer.Start();
        
        let inputsReceived: null | boolean[] = null;
        bajerTcpServer.on("step", (inputs, beo) => {
            inputsReceived = inputs;
        })

        const client = new Net.Socket();
        await new Promise<void>((resolve) => {
            client.connect({
                host: "127.0.0.1",
                port: 1342
            }, () => resolve());
        });
        
        client.write(Buffer.from(Uint8Array.from([0])));
        
        let received_buffer = await new Promise<Buffer>((resolve, reject) => {
            client.once("data", (data) => {
                resolve(data);
            });
        });

        bajerTcpServer.Stop();
        assert.deepEqual(Uint8Array.from(received_buffer), Uint8Array.from([0]));
        assert.deepEqual(inputsReceived, []);
    });

    it("Should receive step with 4 outputs command", async () => {
        let bajerTcpServer = new BajerTCPServer("127.0.0.1", 1344);
        bajerTcpServer.Start();

        let inputsReceived: null | boolean[] = null;
        bajerTcpServer.on("step", (inputs, beo) => {
            inputsReceived = inputs;
            beo.promise = Promise.resolve([true, false, true, true])
        })

        const client = new Net.Socket();
        await new Promise<void>((resolve) => {
            client.connect({
                host: "127.0.0.1",
                port: 1344
            }, () => resolve());
        });
        
        client.write(Buffer.from(Uint8Array.from([2, 0, 4, 0])));
        
        let received_buffer = await new Promise<Buffer>((resolve, reject) => {
            client.once("data", (data) => {
                resolve(data);
            });
        });

        bajerTcpServer.Stop();
        assert.deepEqual(Uint8Array.from(received_buffer), Uint8Array.from([0,0,1,0,1,1]));
        assert.deepEqual(inputsReceived, []);
    });

    it("Should receive step with 4 inputs command", async () => {
        let bajerTcpServer = new BajerTCPServer("127.0.0.1", 1344);
        bajerTcpServer.Start();

        let inputsReceived: null | boolean[] = null;
        bajerTcpServer.on("step", (inputs, beo) => {
            inputsReceived = inputs;
        })

        const client = new Net.Socket();
        await new Promise<void>((resolve) => {
            client.connect({
                host: "127.0.0.1",
                port: 1344
            }, () => resolve());
        });
        
        client.write(Buffer.from(Uint8Array.from([2, 4, 0, 0, 1, 1, 0, 1])));
        
        let received_buffer = await new Promise<Buffer>((resolve, reject) => {
            client.once("data", (data) => {
                resolve(data);
            });
        });

        bajerTcpServer.Stop();
        assert.deepEqual(Uint8Array.from(received_buffer), Uint8Array.from([0,0]));
        assert.deepEqual(inputsReceived, [true, true, false, true]);
    });
    
    it("Should receive step with 4 inputs and 3 outputs", async () => {
        let bajerTcpServer = new BajerTCPServer("127.0.0.1", 1345);
        bajerTcpServer.Start();
    
        let inputsReceived: null | boolean[] = null;
        bajerTcpServer.on("step", (inputs, beo) => {
            inputsReceived = inputs;
            beo.promise = Promise.resolve([true, true, false, true]);
        })

        const client = new Net.Socket();
        await new Promise<void>((resolve) => {
            client.connect({
                host: "127.0.0.1",
                port: 1345
            }, () => resolve());
        });
        
        client.write(Buffer.from(Uint8Array.from([2, 4, 4, 0, 1, 0, 1, 1])));
        
        let received_buffer = await new Promise<Buffer>((resolve, reject) => {
            client.once("data", (data) => {
                resolve(data);
            });
        });

        bajerTcpServer.Stop();
        assert.deepEqual(Uint8Array.from(received_buffer), Uint8Array.from([0, 0, 1, 1, 0, 1]));
        assert.deepEqual(inputsReceived, [true, false, true, true]);
    });
});
import { FileHandle, open } from "fs/promises";
import { Config } from "./IConfigManager";
import { IOutputLogger } from "./IOutputLogger";

export class CSVOutputLogger implements IOutputLogger {
    private _fileHandle: FileHandle;
    private _startTime: Date | null;

    private constructor(fileHandle: FileHandle) {
        this._fileHandle = fileHandle;
        this._startTime = null;
    }

    async BeginRun() {
        this._startTime = new Date();
    }

    async EndRun() {
        this._startTime = null;
        await this._fileHandle.write("\n", null, "utf-8");
        await this._fileHandle.sync();
    }

    static async FromConfig(config: Config): Promise<CSVOutputLogger> {
        let fileHandle = await open(config.outputFilePath, "a");
        return new CSVOutputLogger(fileHandle);
    }

    StartTimer(): void {
        this._startTime = new Date();
    }
    
    async LogState(runId: number, timeStamp: Date, inputState: boolean[], outputState: boolean[]): Promise<void> {
        if (this._startTime == null)
            throw new Error("start time was not set");
        
        let row = [runId.toString(), (timeStamp.getTime() - this._startTime.getTime()).toString()]
            .concat(inputState.map(input => input ? "1" : "0"))
            .concat(outputState.map(output => output ? "1" : "0"))
        await this._fileHandle.write(row.join(",") + "\n", null, "utf-8");
    }

    async WriteHeader(inputNames: string[], outputNames: string[]) {
        let row = ["Run ID", "Timestamp (ms)"].concat(
            inputNames,
            outputNames
        )
        await this._fileHandle.write(row.join(",") + "\n", null, "utf-8");
    }
    
}
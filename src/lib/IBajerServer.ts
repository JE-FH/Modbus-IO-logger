export class BajerEventObject<T> {
    promise: Promise<T>;
    constructor(promise: Promise<T>) {
        this.promise = promise;
    }

    async wait(): Promise<T> {
        return await this.promise;
    }
}

export interface IBajerServer {
    on(event: "setup", listener: (inputCount: number, outputCount: number, beo: BajerEventObject<void>) => void): void;
    on(event: "reset", listener: (beo: BajerEventObject<void>) => void): void;
    on(event: "step", listener: (inputValues: boolean[], beo: BajerEventObject<Array<boolean>>) => void): void;
    on(event: "close", listener: () => void): void;

    Start(): Promise<void>;
    Stop(): void;
}

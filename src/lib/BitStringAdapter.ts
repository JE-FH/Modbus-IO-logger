import { ConstructArrayPattern, ConstructBitPattern, GetBitRange, SetBitRange } from "./Util";

export class BitStringAdapter {
    private _target: Buffer;

    
    SetBits(offset: number, values: boolean[]): void {
        let startByteOffset = Math.floor(offset / 8);
        let endByteOffset = Math.floor((offset + values.length) / 8);
        let startBit = offset % 8;
        let endBit = (offset + values.length) % 8;

        if (startByteOffset == endByteOffset) {
            let current = this._target.at(startByteOffset);
            if (current == undefined)
                throw new Error("offset out of range");

            this._target.writeUint8(SetBitRange(
                current, 
                ConstructBitPattern(values),
                startBit,
                endBit
            ), startByteOffset);
        } else {
            let startBitsEnd = 8 - startBit;
            
            //Write first byte
            let current = this._target.at(startByteOffset);
            if (current == undefined)
                throw new Error("offset out of range");

            this._target.writeUint8(SetBitRange(
                current, 
                ConstructBitPattern(values.slice(0, startBitsEnd)),
                startBit,
                8
            ), startByteOffset);
            
            //Write whole middle Bytes
            for (let i = 0; i + 1 < endByteOffset - startByteOffset; i++) {
                this._target.writeUint8(
                    ConstructBitPattern(values.slice(i * 8 + startBitsEnd, i * 8 + startBitsEnd + 8)),
                    i + startByteOffset + 1
                );
            }

            //write last byte
            current = this._target.at(endByteOffset);
            if (current == undefined)
                throw new Error("offset out of range");
            this._target.writeUint8(SetBitRange(
                current, 
                ConstructBitPattern(values.slice(values.length - endBit, values.length)),
                0,
                endBit
            ), endByteOffset);
        }
    }

    GetBits(offset: number, amount: number): Array<boolean> {
        let startByteOffset = Math.floor(offset / 8);
        let endByteOffset = Math.floor((offset + amount) / 8);
        let startBit = offset % 8;
        let endBit = (offset + amount) % 8;

        if (startByteOffset == endByteOffset) {
            let current = this._target.at(startByteOffset);
            if (current == undefined)
                throw new Error("offset out of range");

            return ConstructArrayPattern(
                GetBitRange(current, startBit, endBit), amount
            );
        } else {
            let rv: boolean[] = [];
            let current = this._target.at(startByteOffset);
            if (current == undefined)
                throw new Error("offset out of range");
            
            rv = rv.concat(
                ConstructArrayPattern(GetBitRange(current, startBit, 8), 8 - startBit)
            );

            for (let i = startByteOffset + 1; i < endByteOffset; i++) {
                let current = this._target.at(i);
                if (current == undefined)
                    throw new Error("offset out of range");

                rv = rv.concat(ConstructArrayPattern(current, 8));
            }

            current = this._target.at(startByteOffset);
            if (current == undefined)
                throw new Error("offset out of range");

            rv = rv.concat(
                ConstructArrayPattern(GetBitRange(current, 0, endBit), endBit)
            );

            return rv;
        }
    }

    public GetBitString(): string {
        let bytes = []
        for (let i = 0; i < this._target.length; i++) {
            let current = this._target.at(i);
            if (current == null)
                throw new Error();
            bytes.push(current.toString(2).padStart(8, "0"));
        }
        return bytes.join(",");
    }

    constructor(buffer: Buffer) {
        this._target = buffer;
    }
}
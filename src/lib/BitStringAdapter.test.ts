import { assert } from "chai";
import { ConstructArrayPattern, ConstructBitPattern, GetBitRange, SetBitRange } from "../Util";
import { BitStringAdapter } from "./BitStringAdapter";

describe("bitstring test", () => {
    it("Should convert to bitstring correctly", () => {
        let actual = ConstructBitPattern([true, false, false, true, true]);
        assert.equal(actual, 0b11001, "test 11001 bit pattern");
    });

    it("Should convert to bitstring correctly", () => {
        let actual = ConstructArrayPattern(0b11001, 5);
        assert.deepEqual(actual, [true, false, false, true, true], "test 11001 bit pattern");
    });

    it("Set bit range should work", () => {
        assert.equal(SetBitRange(0, 0b1011, 1, 5).toString(2), (0b00010110).toString(2), "1011");
    });

    it("Get bit range should work", () => {
        assert.deepEqual(GetBitRange(0b10110101, 1, 5).toString(2), (0b1010).toString(2), "1011");
    })

    it("GetBitString should work", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b1010_1010, 0b1010_1010])));
        assert.equal(adapter.GetBitString(), "10101010,10101010,10101010");
    });

    it("SetBits should work for 8 bits offset by 4", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b0000_0000, 0b1111_1111])));
        adapter.SetBits(4, [true, true, true, true, true, true, false, true]);
        assert.equal(adapter.GetBitString(), "11111010,00001011,11111111");
    });

    it("SetBits should work for 16 bits offset by 4", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b1010_1010, 0b1010_1010])));
        adapter.SetBits(4, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true]);
        assert.equal(adapter.GetBitString(), "11111010,11111111,10101011");
    });

    it("SetBits should work for 16 bits offset by 12", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b1010_1010, 0b1010_1010, 0b1010_1010])));
        adapter.SetBits(12, [true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true]);
        assert.equal(adapter.GetBitString(), "10101010,11111010,11111111,10101011");
    });

    it("SetBits should work for 4 bits offset by 10", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b1010_1010, 0b1010_1010, 0b1010_1010])));
        adapter.SetBits(10, [true, true, false, true]);
        assert.equal(adapter.GetBitString(), "10101010,10101110,10101010,10101010");
    });
    
    it("GetBits should 12 bits offset by 4", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b0000_0000, 0b1111_1111, 0b1001_0010])));
        assert.equal(adapter.GetBits(4, 12).map(x => x ? "1" : "0").join(""), "010100000000");
    })
    
    it("GetBits should 5 bits offset by 9", () => {
        let adapter = new BitStringAdapter(Buffer.from(new Uint8Array([0b1010_1010, 0b0001_0000, 0b1111_1111, 0b1001_0010])));
        assert.equal(adapter.GetBits(9, 5).map(x => x ? "1" : "0").join(""), "00010");
    })
});
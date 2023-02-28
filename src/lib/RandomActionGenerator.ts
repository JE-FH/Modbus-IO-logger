import { randomInt } from "crypto";
import { ChangeInputAction } from "./action/ChangeInputAction";
import { WaitAction } from "./action/WaitAction";
import { IAction, IActionGenerator } from "./IActionGenerator";
import { Config } from "./IConfigManager";



export class RandomActionGenerator implements IActionGenerator {
    private readonly _config: Config;

    constructor(config: Config) {
        this._config = config;
    }

    GenerateRun(actionCount: number): Array<IAction> {
        let actions: IAction[] = [];
        for (let i = 0; i < actionCount; i++) {
            let randomNumber = randomInt(0, 10);
            if (randomNumber != 9) {
                actions.push(new WaitAction());
            } else {
                let inputValues = [];
                for (let b = 0; b < this._config.ModbusDevice.inputSize; b++) {
                    inputValues.push(randomInt(0, 2) == 1);
                }
                actions.push(new ChangeInputAction(this._config.ModbusDevice.inputOffset, inputValues));
            }
        }
        
        return actions;
    }
    
}
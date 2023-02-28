import { randomInt } from "crypto";
import { WaitAction } from "./action/WaitAction";
import { IAction, IActionGenerator } from "./IActionGenerator";



export class RandomActionGenerator implements IActionGenerator {
    constructor() {
        
    }

    GenerateRun(actionCount: number): Array<IAction> {
        let actions: IAction[] = [];
        for (let i = 0; i < actionCount; i++) {
            let randomNumber = randomInt(0, 10);
            if (randomNumber >= 8) {
                actions.push(new WaitAction());
            }
        }
        
        return actions;
    }
    
}
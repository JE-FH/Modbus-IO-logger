import { readFile, writeFile } from "fs/promises";
import { Config, IConfigManager } from "./IConfigManager";
export class FileConfigManager implements IConfigManager {
    constructor() {

    }
    async LoadConfig(): Promise<Config> {
        try {
            let content = await readFile("io-logger.config.json", "utf-8");

            return JSON.parse(content);
        } catch (e) {
            console.log("Could not load config correctly");
            throw e;
        }
    }

    async WriteConfig(config: Config): Promise<void> {
        try {
            await writeFile("io-logger.config.json", JSON.stringify(config, null, 4), "utf-8");
        } catch (e) {
            console.log("Could not write config");
            throw e;
        }
    }
}
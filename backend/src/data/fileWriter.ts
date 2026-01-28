import fs from 'fs/promises';
import path from 'path';
import constants from "node:constants";

export async function writeToFile(data: any, filename: string) {
    try {
        const outputDir = path.join(process.cwd(), 'output');
        await fs.mkdir(outputDir, {recursive: true});
        const filePath = path.join(outputDir, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`Successfully wrote to ${filePath}`);
    } catch (error) {
        console.error('Error writing to file:', error);
        throw error;
    }
}

export async function fileExistsAsync(path: string): Promise<boolean> {
    try {
        await fs.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

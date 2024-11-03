import { CookieParam } from 'puppeteer';
import { readFile } from 'fs/promises';

export const readCookie = async (filePath: string): Promise<CookieParam[]> => {
    try {
        let data = JSON.parse(await readFile(filePath, "utf8"));
        console.log(data)
        return Promise.resolve(data);
    } catch (err) {
        throw new Error(`Error while reading cookies file: ${err}`);
    }
};
/** Saving all data in memory */
import { promises as fs } from 'fs';
import csv from "csvtojson";

const saveToTxt = async (content: string) => {
    await fs.writeFile('./tables.txt', content);
}

const readFiles = (dirname: string): Promise<{ [key in string]: any }[][]> => {
    return fs.readdir(dirname)
        .then((filenames) => Promise.all(filenames.map((filename) => {
            return csv().fromFile(dirname + filename);
        }))
        .catch(err => Promise.reject(err)));
};

(async () => {
    try {
        const allFilesContent = await readFiles('./csv/');

        const readyStr = allFilesContent.map(fileContent => fileContent.map((el) => JSON.stringify(el))
            .reduce((prev, next) => `${prev}\n${next}`, ''))
            .reduce((prev, next) => prev + next, '');

        await saveToTxt(readyStr);
    } catch (err) {
        console.log(err);
    }
})();

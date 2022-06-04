/** Using streams */
import fs from "fs";
import csv from "csvtojson";

const writeFromToStream = (dirname: string, writeStream: fs.WriteStream): Promise<void> => {
    return fs.promises.readdir(dirname)
        .then((filenames) => {
            filenames.forEach((filename: string) => {
                const readStream = fs.createReadStream(dirname + filename);
                readStream.pipe(csv()).pipe(writeStream);
            });
        })
        .catch(err => Promise.reject(err));
};

writeFromToStream('./csv/', fs.createWriteStream('./tables.txt'));

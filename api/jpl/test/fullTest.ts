import { readFileSync, createReadStream } from "node:fs";
import { parse } from 'csv-parse';

const fileBuffer = readFileSync('./api/jpl/test/Mercury_wrt_Earth_uncorrected_20220727190826.csv')
const fileContent = fileBuffer.toString();
console.log(fileContent);

/"Target","MERCURY"/

// createReadStream('./api/jpl/test/Mercury_wrt_Earth_uncorrected_20220727190826.csv')
//     .pipe(parse({ delimiter: ',', from_line: 17 }))
//     .on('data', (row) => {
//         // it will start from 2nd row
//         console.log(row)
//     })

//     parse({ delimiter: ',', from_line: 17 }).
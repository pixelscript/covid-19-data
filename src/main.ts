import * as fs from 'fs';
import _ from 'lodash';
import countries from './static/countries';
import { processReplace, processFlatten } from './static/conversion';

const data = fs.readFileSync('./test.csv', 'UTF-8');
const rowString: Array<string> = data.split('\n');
const rowArray: Array<Array<string>> = [];
rowString.forEach((row, index) => {
  rowArray[index] = row.split(/,(?=\S)|:/);
});
const tableHeader = rowArray[0];
let tableBody = rowArray.splice(1);
tableBody = processReplace(tableBody);
tableBody = processFlatten(tableBody);



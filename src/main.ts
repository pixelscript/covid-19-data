import * as fs from 'fs';
import _ from 'lodash';
import fetch from 'node-fetch';
import { processReplace, processFlatten, rowsToCountries, Country} from './static/conversion';
const source = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

fetch(source)
    .then((res: any) => res.text())
    .then(processData)
    .then(writeToFile);

function processData(data: string){
  const rowString: Array<string> = data.split('\n');
  const rowArray: Array<Array<string>> = [];
  rowString.forEach((row, index) => {
    rowArray[index] = row.split(/,(?=\S)|:/);
  });
  const tableHeader = rowArray[0];
  const series = tableHeader.splice(4);
  let tableBody = rowArray.splice(1);
  tableBody = processReplace(tableBody);
  tableBody = processFlatten(tableBody);
  
  let countries: Array<Country> = rowsToCountries(tableBody);
  countries = _.sortBy(countries, ['total']).reverse();
  return {
    series,
    countries
  }
}
function writeToFile(data: object){
  fs.writeFileSync('../data.json', JSON.stringify(data, null, 2));
  console.log('DONE');
}
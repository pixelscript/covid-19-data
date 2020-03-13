import * as fs from 'fs';
import _ from 'lodash';
import fetch from 'node-fetch';
import {
  processReplace,
  processFlatten,
  topRows,
  rowsToCountries,
  Country
} from './static/conversion';
const sources = [
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
];
const promises: Array<Promise<string>> = [];
sources.forEach(source => {
  promises.push(fetch(source).then((res: any) => res.text()));
});
Promise.all(promises)
  .then(processData)
  .then(writeToFile);

function processData(results: Array<string>) {
  let source: Array<any> = [];
  let series: Array<string>;
  results.forEach((data, arr, index) => {
    const rowString: Array<string> = data.split('\n');
    const rowArray: Array<Array<string>> = [];
    rowString.forEach((row, index) => {
      rowArray[index] = row.split(/,(?=\S)|:/);
    });
    const tableHeader = rowArray[0];
    const labels = tableHeader.splice(4);
    let tableBody = rowArray.splice(1);
    tableBody = processReplace(tableBody);
    tableBody = processFlatten(tableBody);
    source.push(tableBody);
    if (!series) {
      series = labels;
    }
  });
  const consolidated: Array<any> = source[0];
  consolidated.forEach((data, index, arr) => {
    for (let i = 4; i < data.length; i++) {
      data[i] = {
        cases: { value: Number(data[i]) },
        deaths: { value: Number(source[1][index][i]) },
        recoveries: { value: Number(source[2][index][i]) }
      };
    }
  });
  const countries = rowsToCountries(consolidated, topRows(consolidated));
  return {
    series,
    countries
  }
}
function writeToFile(data: object) {
  fs.writeFileSync('data/data.json', JSON.stringify(data));
  console.log('DONE');
}

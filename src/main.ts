import * as fs from 'fs';
import _ from 'lodash';
import fetch from 'node-fetch';
import {
  processData
} from './lib/conversion';
const sources = [
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
];
const promises: Array<Promise<string>> = [];
sources.forEach(source => {
  promises.push(fetch(source).then((res: any) => res.text()));
});
Promise.all(promises)
  .then(processData)
  .then(writeToFile);

function writeToFile(data: object) {
  fs.writeFileSync('data/data.json', JSON.stringify(data));
  console.log('DONE');
}

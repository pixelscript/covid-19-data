import _ from 'lodash';
import { isoMap, countries } from './countries';
export interface Replacement {
  from: string;
  to: string;
}

export let replace: Array<Replacement> = [
  { from: '"Korea, South"', to: 'Korea, Republic of' },
  { from: 'US', to: 'United States of America' },
  { from: 'Brunei', to: 'Brunei Darussalam' },
  { from: 'Iran', to: 'Iran (Islamic Republic of)' },
  { from: 'Curacao', to: 'Curaçao' },
  { from: 'Taiwan*', to: 'Taiwan, Province of China' },
  { from: 'Vietnam', to: 'Viet Nam' },
  { from: 'occupied Palestinian territory', to: 'Palestine, State of' },
  { from: 'Russia', to: 'Russian Federation' },
  { from: 'Moldova', to: 'Moldova, Republic of' },
  { from: 'Venezuela', to: 'Venezuela (Bolivarian Republic of)' },
  { from: 'Bolivia', to: 'Bolivia (Plurinational State of)' },
  { from: 'Congo (Kinshasa)', to: 'Congo, Democratic Republic of the' },
  { from: "Cote d'Ivoire", to: "Côte d'Ivoire" },
  { from: 'Reunion', to: 'Réunion' },
  {
    from: 'United Kingdom',
    to: 'United Kingdom of Great Britain and Northern Ireland'
  }
];

export interface Country {
  name: string;
  codeA3: string;
  codeA2: string;
  data: Array<any>;
}

export let group = [
  { name: 'US', group: 'us-state', region: 'Alaska' },
  { name: 'US', group: 'us-state', region: 'Arizona' },
  { name: 'US', group: 'us-state', region: 'Arkansas' },
  { name: 'US', group: 'us-state', region: 'California' },
  { name: 'US', group: 'us-state', region: 'Colorado' },
  { name: 'US', group: 'us-state', region: 'Connecticut' },
  { name: 'US', group: 'us-state', region: 'Delaware' },
  { name: 'US', group: 'us-state', region: 'District of Columbia' },
  { name: 'US', group: 'us-state', region: 'Florida' },
  { name: 'US', group: 'us-state', region: 'Georgia' },
  { name: 'US', group: 'us-state', region: 'Grand Princess' },
  { name: 'US', group: 'us-state', region: 'Hawaii' },
  { name: 'US', group: 'us-state', region: 'Idaho' },
  { name: 'US', group: 'us-state', region: 'Illinois' },
  { name: 'US', group: 'us-state', region: 'Indiana' },
  { name: 'US', group: 'us-state', region: 'Iowa' },
  { name: 'US', group: 'us-state', region: 'Kansas' },
  { name: 'US', group: 'us-state', region: 'Kentucky' },
  { name: 'US', group: 'us-state', region: 'Louisiana' },
  { name: 'US', group: 'us-state', region: 'Maine' },
  { name: 'US', group: 'us-state', region: 'Maryland' },
  { name: 'US', group: 'us-state', region: 'Massachusetts' },
  { name: 'US', group: 'us-state', region: 'Michigan' },
  { name: 'US', group: 'us-state', region: 'Minnesota' },
  { name: 'US', group: 'us-state', region: 'Mississippi' },
  { name: 'US', group: 'us-state', region: 'Missouri' },
  { name: 'US', group: 'us-state', region: 'Montana' },
  { name: 'US', group: 'us-state', region: 'Nebraska' },
  { name: 'US', group: 'us-state', region: 'Nevada' },
  { name: 'US', group: 'us-state', region: 'New Hampshire' },
  { name: 'US', group: 'us-state', region: 'New Jersey' },
  { name: 'US', group: 'us-state', region: 'New Mexico' },
  { name: 'US', group: 'us-state', region: 'New York' },
  { name: 'US', group: 'us-state', region: 'North Carolina' },
  { name: 'US', group: 'us-state', region: 'North Dakota' },
  { name: 'US', group: 'us-state', region: 'Ohio' },
  { name: 'US', group: 'us-state', region: 'Oklahoma' },
  { name: 'US', group: 'us-state', region: 'Oregon' },
  { name: 'US', group: 'us-state', region: 'Pennsylvania' },
  { name: 'US', group: 'us-state', region: 'Rhode Island' },
  { name: 'US', group: 'us-state', region: 'South Carolina' },
  { name: 'US', group: 'us-state', region: 'South Dakota' },
  { name: 'US', group: 'us-state', region: 'Tennessee' },
  { name: 'US', group: 'us-state', region: 'Texas' },
  { name: 'US', group: 'us-state', region: 'Utah' },
  { name: 'US', group: 'us-state', region: 'Vermont' },
  { name: 'US', group: 'us-state', region: 'Virginia' },
  { name: 'US', group: 'us-state', region: 'Washington' },
  { name: 'US', group: 'us-state', region: 'West Virginia' },
  { name: 'US', group: 'us-state', region: 'Wisconsin' },
  { name: 'US', group: 'us-state', region: 'Wyoming' }
];

export function processReplace(rowArray: Array<Array<any>>) {
  rowArray.forEach((row, index, arr) => {
    const found = _.find(replace, { from: row[1] });
    if (found) {
      arr[index][1] = found.to;
    }
  });
  return rowArray;
}

export function processFlatten(rowArray: Array<Array<any>>) {
  let newArr: Array<Array<any>> = [...rowArray];
  let lastCountry: string = '';
  sortName(newArr);
  for (let i = 0; i < newArr.length; i++) {
    const row = newArr[i];
    newArr[i] = stringSeriesToNumberSeries(row);
    const country = row[1];
    if (lastCountry === country) {
      newArr[i - 1] = addRowsTogether(newArr[i - 1], row);
      newArr.splice(i, 1);
      i--;
    }
    lastCountry = country;
  }
  return newArr;
}

const DIMENSIONS = {
  RECOVERIES: 'recoveries',
  CASES: 'cases',
  DEATHS: 'deaths'
}

export function topRows(rowArray: Array<Array<any>>){
  let cases;
  let deaths;
  let recoveries;
  sortValue(rowArray, DIMENSIONS.RECOVERIES);
  recoveries = rowArray[0][rowArray[0].length-1][DIMENSIONS.RECOVERIES].value;
  sortValue(rowArray, DIMENSIONS.DEATHS);
  deaths = rowArray[0][rowArray[0].length-1][DIMENSIONS.DEATHS].value;
  sortValue(rowArray, DIMENSIONS.CASES);
  cases = rowArray[0][rowArray[0].length-1][DIMENSIONS.CASES].value;
  return {
    cases,
    deaths,
    recoveries
  }
}

export function rowsToCountries(rowArray: Array<Array<any>>, topItems: Object) {
  const countries: Array<Country> = [];
  rowArray.forEach(row => {
    const cnt = rowToCountry(row, topItems);
    if (cnt) {
      countries.push(cnt);
    }
  });
  return countries;
}

function rowToCountry(arr: Array<any>, topItems: Object) {
  const cnt = _.find(countries, { name: arr[1] });
  const data = formatData(arr.slice(4), topItems);
  if (cnt) {
    const country: Country = {
      name: arr[1],
      codeA3: cnt['alpha-3'],
      codeA2: isoMap[cnt['alpha-3']],
      data
    };
    return country;
  } else {
    console.warn('Could not find country: '+arr[1])
  }
}

function formatData(arr: Array<any>, topValues: any) {
  const formatted: Array<any> = [];
  const maxCasesLog = safeLog(topValues.cases);
  const maxRecoveriesLog = safeLog(topValues.recoveries);
  const maxDeathsLog = safeLog(topValues.deaths);
  arr.forEach((value: any) => {
    value[DIMENSIONS.CASES].log = safeLog(value[DIMENSIONS.CASES].value);
    value[DIMENSIONS.CASES].logPercent = (value[DIMENSIONS.CASES].log / maxCasesLog) * 100;
    value[DIMENSIONS.RECOVERIES].log = safeLog(value[DIMENSIONS.RECOVERIES].value);
    value[DIMENSIONS.RECOVERIES].logPercent = (value[DIMENSIONS.RECOVERIES].log / maxRecoveriesLog) * 100;
    value[DIMENSIONS.DEATHS].log = safeLog(value[DIMENSIONS.DEATHS].value);
    value[DIMENSIONS.DEATHS].logPercent = (value[DIMENSIONS.DEATHS].log / maxDeathsLog) * 100;
    formatted.push(value);
  });
  return formatted;
}

function safeLog(n: number) {
  return Math.max(0,Math.log10(n));
}

function addRowsTogether(row1: Array<any>, row2: Array<any>) {
  for (let i = 4; i < row1.length; i++) {
    row1[i] = Number(row1[i]) + Number(row2[i]);
  }
  return row1;
}

function stringSeriesToNumberSeries(arr: Array<any>) {
  for (let i = 4; i < arr.length; i++) {
    arr[i] = Number(arr[i]);
  }
  return arr;
}

function sortName(arr: Array<Array<any>>) {
  arr.sort((one, two) => {
    const a = one[1];
    const b = two[1];
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });
}

function sortValue(arr: Array<Array<any>>, path:string) {
  arr.sort((one, two) => {
    const a = one[one.length-1][path].value;
    const b = two[two.length-1][path].value;
    return a < b ? 1 : -1;
  });
}

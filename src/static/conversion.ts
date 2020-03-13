import _ from 'lodash';
import {isoMap, countries} from './countries';
export interface Replacement {
  from: string;
  to: string;
}

export let replace: Array<Replacement> = [
  { from: '"Korea, South"', to: 'Korea, Republic of' },
  { from: 'US', to: 'United States of America' },
  { from: 'Brunei', to: 'Brunei Darussalam' },
  { from: 'Iran', to: 'Iran (Islamic Republic of)' },
  { from: 'Taiwan*', to: 'Taiwan, Province of China' },
  { from: 'Vietnam', to: 'Viet Nam' },
  { from: 'Russia', to: 'Russian Federation' },
  { from: 'Moldova', to: 'Moldova, Republic of' },
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
  data: Array<Number>;
  total: Number;
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
  sort(newArr);
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

export function rowsToCountries(rowArray: Array<Array<any>>) {
  const countries: Array<Country> = [];
  rowArray.forEach(row => {
    countries.push(rowToCountry(row));
  });
  return countries;
}

function rowToCountry(arr: Array<any>) {
  const cnt = _.find(countries, { name: arr[1] });
  const data = arr.splice(4);
  if (cnt) {
    const country: Country = {
      name: arr[1],
      codeA3: cnt['alpha-3'],
      codeA2: isoMap[cnt['alpha-3']],
      data,
      total: data[data.length-1]
    };
    return country;
  }
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

function sort(arr: Array<Array<any>>) {
  arr.sort((one, two) => {
    const a = one[1];
    const b = two[1];
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });
}

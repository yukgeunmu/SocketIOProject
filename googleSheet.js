import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEET_ID = process.env.SHEET_ID;
// WARNING: It is insecure to expose your API key in code.
// It is recommended to use environment variables or other secure methods.
const API_KEY = process.env.API_KEY;

export const fetchAndSaveAllSheets = async () => {
  try {
    // 1. Get spreadsheet metadata to find all sheet names
    const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
    const metaResponse = await fetch(metaUrl);
    const metaData = await metaResponse.json();
    if (!metaData.sheets) {
      throw new Error(
        'Could not retrieve sheet information. Please check your SHEET_ID and API_KEY.',
      );
    }
    const sheetTitles = metaData.sheets.map((sheet) => sheet.properties.title);

    console.log(`Found sheets: ${sheetTitles.join(', ')}`);

    const allSheetsData = {};

    // 2. Loop through each sheet title and fetch its data
    for (const title of sheetTitles) {
      // Assuming data is always in columns A-H.
      const sheetRange = `${title}!A:L`;
      const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetRange}?key=${API_KEY}`;

      console.log(`Fetching data from "${title}"...`);
      const dataResponse = await fetch(dataUrl);
      const sheetData = await dataResponse.json();

      if (sheetData.values && sheetData.values.length > 2) {
        // Process rows into JSON objects
        const headers = sheetData.values[0];
        const types = sheetData.values[1];
        const dataRows = sheetData.values.slice(2);
        const jsonData = dataRows.map((row) => {
          const rowObject = {};
          headers.forEach((header, index) => {
            const preValue = row[index].trim() || '';
            const preType = types[index].trim() || '';
            const value = preValue;
            const type = preType;
            const trimHeader = header.trim();
            if (type === 'int') {
              const parsedValue = parseInt(value, 10);
              rowObject[trimHeader] = isNaN(parsedValue) ? 0 : parsedValue;
            } else if (type === 'float') {
              const parsedValue = parseFloat(value);
              rowObject[trimHeader] = isNaN(parsedValue) ? 0.0 : parsedValue;
            } else {
              rowObject[trimHeader] = value;
            }
          });
          return rowObject;
        });
        allSheetsData[title] = jsonData;
      } else {
        console.log(`No data, header, or type row found in sheet: "${title}"`);
        allSheetsData[title] = [];
      }
    }

    // 3. Save the combined data into one file

    for (var data in allSheetsData) {
      const outPath = path.join(__dirname, `./assets/${data}.json`);
      const loadData = allSheetsData[data];
      const object = {
        name: data,
        data: loadData,
      };
      fs.writeFileSync(outPath, JSON.stringify(object, null, 2), 'utf-8');
      console.log(`\nSuccessfully saved all sheet data to ${data}`);
    }
  } catch (error) {
    console.error('\nAn error occurred:', error);
  }
};

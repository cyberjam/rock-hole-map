import { google } from 'googleapis';
import axios from 'axios';

function makeCoords(degree) {
    const degreeArray = degree.split(',');
    const northDegree = degreeArray[0].trim();
    const eastDegree = degreeArray[1].trim();

    const dmsToCoord = (DMS) => {
        const coordArray = DMS.replace('″', '').replace('"', '').split(/[°′']/);
        return (
            Number(coordArray[0]) +
            Number(coordArray[1]) / 60 +
            Number(coordArray[2]) / (60 * 60)
        );
    };
    return {
        lat: dmsToCoord(northDegree.replace('N', '')),
        lng: dmsToCoord(eastDegree.replace('E', '')),
    };
}

export async function getSpreadSheetData() {
    try {
        const target = [
            'https://www.googleapis.com/auth/spreadsheets.readonly',
        ];
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            null,
            (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            target,
        );

        const sheets = google.sheets({ version: 'v4', auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: '바위구멍', // sheet name
        });

        const rows = response.data.values;
        const attributes = rows.shift();
        if (rows.length) {
            const result = rows.map((row) => {
                let instance = {};
                attributes.forEach((attribute, index) => {
                    instance[attribute] = row[index];
                });
                return instance;
            });
            return result.map((row) => {
                const coord = makeCoords(row['위경도']);
                return { ...row, ...coord };
            });
        }
    } catch (err) {
        console.log(err);
    }
    return [];
}

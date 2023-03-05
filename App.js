const { GoogleAuth, GoogleApi } = require("google-auth-library");
const { google } = require("googleapis");
const fs = require("fs");
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listeneing @ ${port}`);
})

app.use(express.static('public'));
app.use(express.json({ limit: '100kb' }));

app.post('/SleepData', async (request, response) => {
    let vData = request.body;
    let vDataArray = [[
        vData.Date, vData["Wake Up Time"]
        , vData["Sleep Hrs"], vData["Sleep Index"]
        , , vData["Sleep Type"], vData["Dream Note"]
        , vData["MD"], vData["MD Time"]
    ]];
    //**************Below code is to put sleep time before the current line in spreadsheet*************//
    let vSleepTime;
    if (Number(vData["Sleep Time"].substring(0, 2)) <= 11) {
        if (vData["Sleep Time"].substring(0, 2) == '00') {
            vSleepTime = [[`12:${vData["Sleep Time"].substr(3, 2)} AM (next day)`]];
        } else {
            vSleepTime = [[`${vData["Sleep Time"]} AM (next day)`]];
        }
    }
    else {
        vSleepTime = [[vData["Sleep Time"]]];
    }
    //***********************************************************************************************//
    try {
        const vUpdatedRow = await writeToGoogleSheet(vDataArray, vSleepTime);
        response.json({
            status: "successful",
            "Row updated": vUpdatedRow,
            "Data": vDataArray
        })
    } catch (error) {
        response.json({
            status: "Failed",
            "error": error
        })
    }

})

async function writeToGoogleSheet(values, SleepTime) {
    const privateKey = fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwtClient = new GoogleAuth({
        key: privateKey,
        scopes: scopes
    });
    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const request = {
        spreadsheetId: "1b5qBcbJuE5mAhqlpxPnov2pOTkXtJTJMzFADqPIyiLA",
        //ReadFromGoogleSheet() will return the bank cell range
        range: `Sleep!A${await ReadFromGoogleSheet()}`, 
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: {
            values: values
        }

    };
    //**************Below code is to put sleep time before the current line in spreadsheet*************//
    const SleepTimeRequest = {
        spreadsheetId: "1b5qBcbJuE5mAhqlpxPnov2pOTkXtJTJMzFADqPIyiLA",
        range: `Sleep!E${await ReadFromGoogleSheet() - 1}`,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: SleepTime
        }
    };
    //************************************************************************************************//
    try {
        const response = (await sheets.spreadsheets.values.append(request)).data.updates.updatedRange;
        const SleepTimeResponse = (await sheets.spreadsheets.values.update(SleepTimeRequest)).data.updatedRange;
        const CellsUpdated = `${response} and ${SleepTimeResponse}`;
        return CellsUpdated;
    } catch (error) {
        return error;
    }

    //*************************Below is one more way to wrire above code*****************************//
    // sheets.spreadsheets.values.append(request, (err, res) => {
    //     if (err) return console.log(`The API returned an error: ${err}`);
    //     console.log(res.data);
    // });
    //**********************************************************************************************//
}

async function ReadFromGoogleSheet() {
    const privateKey = fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwtClient = new GoogleAuth({
        key: privateKey,
        scopes: scopes
    });
    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const sheetId = "1b5qBcbJuE5mAhqlpxPnov2pOTkXtJTJMzFADqPIyiLA";
    const range = "Sleep";
    const request = {
        spreadsheetId: sheetId, range: range
    }
    try {
        const response = (await sheets.spreadsheets.values.get(request)).data.values.length + 1;
        return response;
    } catch (error) {
        return error;
    }
}
/*1*/document.querySelector("#submit-button").addEventListener("click", (event) => {
    event.preventDefault();
    let WriteRow = {
        "Date": "",
        "Wake Up Time": "",
        "Sleep Time": "",
        "Sleep Type": "",
        "Sleep Hrs": "",
        "Sleep Index": "",
        "Dream Note": "",
        "MD": "",
        "MD Time": ""
    };

    WriteRow["Date"] = document.querySelector("#date").value;
    WriteRow["Wake Up Time"] = document.querySelector("#wakeup").value;
    WriteRow["Sleep Time"] = document.querySelector("#sleep").value;
    WriteRow["Sleep Type"] = document.querySelector("#SleepType").value;
    WriteRow["Sleep Hrs"] = document.querySelector("#SleepHrs").value;
    WriteRow["Sleep Index"] = document.querySelector("#SleepIndex").value;
    WriteRow["Dream Note"] = document.querySelector("#DreamNote").value;
    WriteRow["MD"] = document.querySelector("#MD").value;
    WriteRow["MD Time"] = document.querySelector("#MDTime").value;

    let vConfirm = confirm(`Are you sure you want to submit below data
Date: ${WriteRow["Date"]}
Wake Up Time: ${WriteRow["Wake Up Time"]}
Sleep Hrs: ${WriteRow["Sleep Hrs"]}
Sleep Index: ${WriteRow["Sleep Index"]}
Sleep Time: ${WriteRow["Sleep Time"]}
Sleep Type: ${WriteRow["Sleep Type"]}
Dream Note: ${WriteRow["Dream Note"]}
MD: ${WriteRow["MD"]}
MD Time: ${WriteRow["MD Time"]}`);

    if (vConfirm === true) {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(WriteRow)
        }
        fetch('/SleepData', options).then((res) => {  //POST method to send and receive data from server
            return res.json();
        }).then((response) => {
            document.querySelector("#Status").innerText = `Data is successfully written at ${response["Row updated"]}`
        });
    }
});

/*2*/document.querySelector("#logout").addEventListener("click", (event) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch('/LoginPage', options).then((res) => {  //POST method to receive HTML page from server
        return res.text();
    }).then((response) => {
        document.open('text/html');
        document.write(response);
        document.close();
    });

});

/*3*/document.querySelector("#History").addEventListener("click", (event) => {

    //----------DOM Manupulation to change the nav bar-----------------------------
    const vHistory = document.querySelector("#History");
    vHistory.className = "active";
    vHistory.removeAttribute("href");

    const vHome = document.querySelector("#Home");
    vHome.removeAttribute("class");
    const att = document.createAttribute("href");
    vHome.setAttributeNode(att);
    att.value = " ";
    //-----------------------------------------------------------------------------

    const vForm = document.getElementsByTagName("form")[0];
    document.getElementsByTagName("form")[0].remove();

    const vStatus = document.querySelector("#Status");
    document.querySelector("#Status").remove();

    const vTable = document.createElement("table");
    vTable.id = "HistoryData";
    vTable.className = "my-4 table table-bordered table-striped table-dark";
    document.body.appendChild(vTable);
    let table = '';

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch('/HistoryPage', options).then((res) => {  //POST method to request data from server
        return res.json();
    }).then((response) => {
        let vStartRow = response.startRow - 1;
        response.Data.forEach((row, i) => {
            table += `<tr>`;
            if (i == 0) {
                row.forEach((cell) => {
                    table += `<th>${cell}</th>`;
                });
            }
            else {
                row.forEach((cell) => {
                    table += `<td>${cell}</td>`;
                });
            }
            table += `</tr>`
        });
        vTable.innerHTML = table;

        //----------DOM Manupulation to add modify option-------------------------------
        const vModifyDiv = document.createElement("Div");
        vModifyDiv.className = "my-1";
        vModifyDiv.style = "text-align: center; margin: auto;";

        let vOptions;
        for (let i = 11; i >= 2; i--) {
            vOptions += `<option value="${i - 1}">${i - 1}</option>`
        }

        const vModifySelector =
            `<form>
        <label for="Sr">Select a row to modify:</label>
        <select name="Sr" id="Sr">
        ${vOptions}
        </select>
        <input type="submit" class="btn-primary" value="Modify" id="Modify">
        </form>`

        vModifyDiv.innerHTML = vModifySelector;
        document.body.appendChild(vModifyDiv);
        //-----------------------------------------------------------------------------

        //---------------------------Event listener for Modify button--------------------------------------------------------------------
        document.querySelector("#Modify").addEventListener("click", (event) => {
            event.preventDefault();
            let vRow = Number(document.querySelector("#Sr").value);
            let vModifyRowNo = vStartRow + vRow; //getting the sheetrow to be modified

            //------------fetching content of row to be modified--------------------------------------------------------
            let vModifyRowDOM = document.querySelector("#HistoryData").rows.item(vRow).getElementsByTagName("td");
            let vSleepTimeCell = document.querySelector("#HistoryData").rows.item(vRow - 1).getElementsByTagName("td");
            let vModifyRowContent = [];
            for (let i = 1; i < vModifyRowDOM.length; i++) {
                if (i == 5) {
                    let vSleepTime = vSleepTimeCell[i].innerText.replace(" (next day)", "").toLowerCase()
                    vModifyRowContent.push(vSleepTime)
                }
                else {
                    vModifyRowContent.push(vModifyRowDOM[i].innerText)
                }
            }
            //----------------------------------------------------------------------------------------------------------


            //------------fetching the home page to modify row-----------------------------------------
            fetch('/HomePage', options).then((res) => {  //POST method to receive HTML page from server
                return res.text();
            }).then((response) => {
                document.open('text/html');
                document.write(response);
                document.close();

                let vFetchDreamBody = {
                    "Row": vModifyRowNo
                };
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(vFetchDreamBody)
                }
                //------------fetching the dream into modify row array----------------
                fetch('/ReturnDream', options).then((res) => {  //POST method to receive data from server
                    return res.json();
                }).then((response) => {
                    document.querySelector("#submit-button").style = 'display: none;'; //hiding submit button
                    document.querySelector("#update-button").style = 'display: inline-block'; //show update button
                    vModifyRowContent.splice(6, 0, response.Dream[0][0]); //Added drem data to array
                    //------------------- converting date into accetable format for input date box---------------------------------------------------
                    let vMonth = Number(vModifyRowContent[0].split("/")[1]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
                    let vDate = Number(vModifyRowContent[0].split("/")[0]).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
                    let vYear = vModifyRowContent[0].split("/")[2];
                    document.querySelector("#date").value = `${vYear}-${vMonth}-${vDate}`;//Old Date is received in form
                    //--------------------------------------------------------------------------------------------------------------------------------
                    //------------------- converting time into accetable format for input time box----------------------------------------------------------------------
                    let vtimeHr = new Date(`2000-01-01 ${vModifyRowContent[1]}`).getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
                    let vtimeMin = new Date(`2000-01-01 ${vModifyRowContent[1]}`).getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
                    document.querySelector("#wakeup").value = `${vtimeHr}:${vtimeMin}`;//Old Wakeup time is received in form
                    //--------------------------------------------------------------------------------------------------------------------------------------------------
                    //------------------- converting time into accetable format for input time box----------------------------------------------------------------------
                    vtimeHr = new Date(`2000-01-01 ${vModifyRowContent[4]}`).getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
                    vtimeMin = new Date(`2000-01-01 ${vModifyRowContent[4]}`).getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
                    document.querySelector("#sleep").value = `${vtimeHr}:${vtimeMin}`;//Old sleep is received in form
                    //--------------------------------------------------------------------------------------------------------------------------------------------------
                    //---------Receiving other Old form elements from array-----------------
                    document.querySelector("#SleepType").value = vModifyRowContent[5];
                    document.querySelector("#SleepHrs").value = vModifyRowContent[2];
                    document.querySelector("#SleepIndex").value = vModifyRowContent[3];
                    document.querySelector("#DreamNote").value = vModifyRowContent[6];
                    document.querySelector("#MD").value = vModifyRowContent[7];
                    document.querySelector("#MDTime").value = vModifyRowContent[8];
                    //------------------------------------------------------------------
                    //------------------------Defining the events for update button click when user has updated the content------------
                    document.querySelector("#update-button").addEventListener("click", (event) => {
                        event.preventDefault();
                        let WriteRow = {
                            "Date": "",
                            "Wake Up Time": "",
                            "Sleep Time": "",
                            "Sleep Type": "",
                            "Sleep Hrs": "",
                            "Sleep Index": "",
                            "Dream Note": "",
                            "MD": "",
                            "MD Time": "",
                            "ModifyRow": vModifyRowNo
                        };
                    
                        WriteRow["Date"] = document.querySelector("#date").value;
                        WriteRow["Wake Up Time"] = document.querySelector("#wakeup").value;
                        WriteRow["Sleep Time"] = document.querySelector("#sleep").value;
                        WriteRow["Sleep Type"] = document.querySelector("#SleepType").value;
                        WriteRow["Sleep Hrs"] = document.querySelector("#SleepHrs").value;
                        WriteRow["Sleep Index"] = document.querySelector("#SleepIndex").value;
                        WriteRow["Dream Note"] = document.querySelector("#DreamNote").value;
                        WriteRow["MD"] = document.querySelector("#MD").value;
                        WriteRow["MD Time"] = document.querySelector("#MDTime").value;
                    
                        let vConfirm = confirm(`Are you sure you want to submit below data
                    Date: ${WriteRow["Date"]}
                    Wake Up Time: ${WriteRow["Wake Up Time"]}
                    Sleep Hrs: ${WriteRow["Sleep Hrs"]}
                    Sleep Index: ${WriteRow["Sleep Index"]}
                    Sleep Time: ${WriteRow["Sleep Time"]}
                    Sleep Type: ${WriteRow["Sleep Type"]}
                    Dream Note: ${WriteRow["Dream Note"]}
                    MD: ${WriteRow["MD"]}
                    MD Time: ${WriteRow["MD Time"]}`);
                    
                        if (vConfirm === true) {
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(WriteRow)
                            }
                            fetch('/SleepData', options).then((res) => {  //POST method to send and receive data from server
                                return res.json();
                            }).then((response) => {
                                document.querySelector("#Status").innerText = 
                                `Data is successfully updated at ${response["Row updated"]}
                                 Please validate History page`
                            });
                        }
                    });
                    //-------------------------------------------------------------------------------------------------------------------------
                });
                //-------------------------------------------------------------------
            });
            //-----------------------------------------------------------------------------------------
        });
        //-----------------------------------------------------------------------------------------------------------------------------
    });
});

/*4*/document.querySelector("#Home").addEventListener("click", (event) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch('/HomePage', options).then((res) => {  //POST method to receive HTML page from server
        return res.text();
    }).then((response) => {
        document.open('text/html');
        document.write(response);
        document.close();
    });
});

/*5*/function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
    let vlogout = document.getElementById("logout");
    if (vlogout.className === "logout") {
        vlogout.removeAttribute("class")
    } else {
        vlogout.className = "logout"
    }
}
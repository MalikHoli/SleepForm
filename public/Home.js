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
        fetch('/SleepData', options).then((res) => {  //POST method to send data at server
            return res.json();
        }).then((response) => {
            // console.log(response);
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
    fetch('/LoginPage', options).then((res) => {  //POST method to send data at server
        return res.text();
    }).then((response) => {
        document.open('text/html');
        document.write(response);
        document.close();
    });

});

/*3*/document.querySelector("#History").addEventListener("click", (event) => {
    const vHistory = document.querySelector("#History");
    vHistory.className = "nav-link active";
    vHistory.removeAttribute("href");

    const vHome = document.querySelector("#Home");
    vHome.className = "nav-link";
    const att = document.createAttribute("href");
    vHome.setAttributeNode(att);
    att.value = " ";
    document.getElementsByTagName("li")[0].className = "nav-item"
    document.getElementsByTagName("li")[1].className = "nav-item active"

    document.getElementsByTagName("form")[0].remove();
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
    fetch('/HistoryPage', options).then((res) => {  //POST method to send data at server
        return res.json();
    }).then((response) => {
        // console.log(response.Data);
        response.Data.forEach((row, i) => {
            table += `<tr>`;
            if (i == 0) {
                row.forEach((cell, j) => {
                    table += `<th>${cell}</th>`;
                });
            }
            else {
                row.forEach((cell, j) => {
                    table += `<td>${cell}</td>`;
                });
            }
            table += `</tr>`
        });
        vTable.innerHTML = table;
    });
});

/*4*/document.querySelector("#Home").addEventListener("click", (event) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch('/HomePage', options).then((res) => {  //POST method to send data at server
        return res.text();
    }).then((response) => {
        document.open('text/html');
        document.write(response);
        document.close();
    });
});
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
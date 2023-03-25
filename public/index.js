document.querySelector("#Submit").addEventListener("click", (event) => {
    event.preventDefault();
    let vUserName = document.querySelector("#username").value;
    let vPwd = document.querySelector("#password").value;


    // console.log(`You entered ${vUserName} and ${vPwd}`);

    const vCredentials = {
        "UserId": vUserName,
        "Pwd": vPwd
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vCredentials)
    }

    fetch('/LoginData', options).then((res) => {  //POST method to send data at server
        return res.text();
    }).then((response) => {
        // console.log(response);
        if (response == 10) {
            document.getElementById("LoginPage").reset();
            const vNewP = document.createElement('p');
            vNewP.className = "Invalid my-3";
            vNewP.innerText = "Invalid Username or Password";
            document.body.appendChild(vNewP);
        }
        else {
            document.open('text/html');
            document.write(response);
            document.close();
        }
    });
})
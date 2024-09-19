async function signIn() {
   const popup = Notification();
    const user_dto = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,

    };

    console.log(user_dto);

    const response = await fetch(
            "SignIn",
            {
                method: "POST",
                body: JSON.stringify(user_dto),
                headers: {
                    "Content-Type": "application/json"
                }
            }
    );
 if (response.status === 404) {


        window.location.href = "404ErrorPage.html";
        return;
    } else if (response.status === 500) {

        window.location.href = "500ErrorPage.html";
        return;
    }
    
    if (response.ok) {
        const json = await  response.json();
        if (json.success) {
            window.location = "index.html";
        } else {

            if (json.content === "Unverified") {
                window.location = "verify-account.html";
            } else {
                popup.error({

                    message: json.content
                });

            }
        }
    } else {
        document.getElementById("message").innerHTML = "Please Try Again Later!!!!";
        }

}
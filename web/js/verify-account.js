async function verifyAccount() {
    const popup = Notification();
    const dto = {
        verification: document.getElementById("verificationCode").value,
    };

    const response = await fetch(
            "Verification",
            {
                method: "POST",
                body: JSON.stringify(dto),
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

        const json = await response.json();

        if (json.success) {
            window.location = "index.html";
        } else {

            popup.error({

                message: json.content
            });
        }

    } else {
        popup.error({

            message: "Please try again later"
        });
    }

}
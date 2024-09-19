/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

async function signUp() {
  const popup = Notification();
    const user_dto = {
        fname: document.getElementById("fname").value,
        lname: document.getElementById("lname").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
//    console.log(user_dto);

    const response = await fetch(
            "SignUp",
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
        const json = await response.json();
       if(json.success){
           window.location ="verify-account.html";
       }else{
          
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

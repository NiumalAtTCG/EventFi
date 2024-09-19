// Payment completed. It can be a successful failure.
payhere.onCompleted = function onCompleted(orderId) {
    console.log("Payment completed. OrderID:" + orderId);
    // Note: validate the payment and show success or failure page to the customer
};

// Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
};

// Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
};



async function loadData() {
//    const popup = Notification();
    const response = await fetch(
            "LoadCheckout",
            );
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //store response data   
            const address = json.address;
            const cityList = json.cityList;
            const cartList = json.cartList;
            //load cities
            let citySelect = document.getElementById("city")
            citySelect.length = 1;
            cityList.forEach(city => {
                let cityOption = document.createElement("option");
                cityOption.value = city.id;
                cityOption.innerHTML = city.name;
                citySelect.appendChild(cityOption);
            });
                     city.dispatchEvent(new Event("change"));
            //load Current Address
            let currentAddressCheckbox = document.getElementById("checkbox1");
            currentAddressCheckbox.addEventListener("change", e => {
                let first_name = document.getElementById("first-name");
                let last_name = document.getElementById("last-name");
                let city = document.getElementById("city");
                let email= document.getElementById("email");
                
                let mobile = document.getElementById("mobile");
                if (currentAddressCheckbox.checked) {
                    first_name.value = address.first_name;
                    last_name.value = address.last_name;
                    city.value = address.city.id;
                    city.disabled = true;
                    city.dispatchEvent(new Event("change"));
                    email.value = address.email;
                    
                    mobile.value = address.mobile;
                } else {
                    first_name.value = "";
                    last_name.value = "";
                    city.value = 0;
                    city.disabled = false;
                    city.dispatchEvent(new Event("change"));
                    email.value = "";         
                    mobile.value = "";
                }
            });
            // Load cart items
            let st_tbody = document.getElementById("st-tbody");
            let st_item_tr = document.getElementById("st-item-tr");
           
           
            let st_order_total_tr = document.getElementById("st-order-total-tr");
            st_tbody.innerHTML = ""; // Clear table body

            let sub_total = 0;
            cartList.forEach(item => {
                let st_item_clone = st_item_tr.cloneNode(true); // Clone the item row
                st_item_clone.querySelector("#st-item-title").innerHTML = item.product.title;
                st_item_clone.querySelector("#st-item-qty").innerHTML = item.qty;
                let item_sub_total = item.product.price * item.qty;
                sub_total += item_sub_total;
                st_item_clone.querySelector("#st-item-subtotal").innerHTML = new Intl.NumberFormat(
                        "en-US", {
                            minimumFractionDigits: 2
                        }).format(item_sub_total);
                st_tbody.appendChild(st_item_clone);
            });
            // Set the order subtotal
            st_order_total_tr.querySelector("#st-total").innerHTML = new Intl.NumberFormat(
                    "en-US", {
                        minimumFractionDigits: 2
                    }).format(sub_total);
            st_tbody.appendChild(st_order_total_tr);
            //update shippting chargers
            
   
        } else {
            window.location = "user_login.html";
               }
        }
}

async function checkout() {
//check address
    let  isCurrentAddress = document.getElementById("checkbox1").checked;
    //get address data
    let first_name = document.getElementById("first-name");
    let last_name = document.getElementById("last-name");
    let city = document.getElementById("city");
    let email = document.getElementById("email");
    let mobile = document.getElementById("mobile");
    const data = {
        isCurrentAddress: isCurrentAddress,
        first_name: first_name.value,
        last_name: last_name.value,
        city_id: city.value,
        email: email.value,
 
        mobile: mobile.value
    };
    //request data(json)
    const response = await fetch(
            "Checkout",
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }
    );
    if (response.ok) {
        const json = await  response.json();
        const popup = Notification();
        console.log(json);
        if (json.success) {
            console.log(json.payhereJson);
           payhere.startPayment(json.payhereJson);
           
        } else {
            popup.error({

                message: json.message
            });
        }
    } else {
        console.log("Try again Later!");
        }

}
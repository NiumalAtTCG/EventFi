async function indexOnloadProducts() {
// const popup = Notification();
    const response = await fetch(
            "LoadiIndexCategoryList",
            );

    if (response.ok) {

        const json = await response.json();
        console.log(json);
        
           let ProductHtml = document.getElementById("similer-product");
            document.getElementById("similer-product-main").innerHTML = "";
                            json.productList.forEach(item => {

                let productCloneHtml = ProductHtml.cloneNode(true);
//                productCloneHtml.querySelector("#similer-product-categoty").innerHTML = item.event.category.name;
                productCloneHtml.querySelector("#similer-product-a").href = "single_product_view.html?id=" + item.id;
                productCloneHtml.querySelector("#similer-product-image").src = "product-images/" + item.id + "/"+item.id+"image.png";
               
                productCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;
                productCloneHtml.querySelector("#similer-product-location").innerHTML = item.eventOn;
                productCloneHtml.querySelector("#similer-product-date").innerHTML = item.date_time;
                productCloneHtml.querySelector("#similer-product-price").innerHTML = "Rs. " + new Intl.NumberFormat(
                        "en-US",
                        {
                            minimumFractionDigits: 2
                        }
                ).format(item.price);
             

                productCloneHtml.querySelector("#similer-product-add-to-cart").addEventListener(
                        "click",
                        (e) => {
                    addToCart(item.id, 1);
                    e.preventDefault();
                });

                //change other tags

                document.getElementById("similer-product-main").appendChild(productCloneHtml);

            });


    } else {
        //document.getElementById("message").innerHTML = "Please try again later!";
           popup.error({

                message: "unable to process your request"
            });
    }

}

async function loadHeader() {

    const resp = await fetch("header.html");
    const headerContent = await resp.text();
    document.getElementById("headerContent").insertAdjacentHTML("afterbegin", headerContent);
    window.scrollTo(0, 0);

}

function gotocart(){
  window.location ="cart.html"  ;
}
function gotosearch(){
      window.location ="advanceSearch.html"  ;
}
function gotoaddproduct(){
      window.location ="addProduct.html"  ;
}
function gotoindex (){
    window.location = "index.html"
}
function  gotoChechout(){
    window.location="checkout.html";
}


async  function checkSignIn() {

    const response = await fetch(
            "CheckSignin",
            );

    if (response.ok) {
        const json = await  response.json();


        const response_dto = json.response_dto;


        if (response_dto.success) {
            //sign in
            const user = response_dto.content;

                alert("ok");

            let st_button_1 = document.getElementById("st-button-1");
            st_button_1.href = "SignOut";
            st_button_1.innerHTML = "SignOut";

            let st_div_1 = document.getElementById("st-div-1");
            st_div_1.remove();

        } else {
            //not sign in

        }
    
    }
}
async function addToCart(id, qty) {
 const popup = Notification();
    const response = await fetch(
            "AddToCart?id=" + id + "&qty=" + qty + "",
            );

    if (response.ok) {

        const json = await response.json();
        if(json.success){
                popup.success({

                message: json.content
            });
        }else{
               popup.error({

                message: json.content
            });
        }

    } else {
        //document.getElementById("message").innerHTML = "Please try again later!";
           popup.error({

                message: "unable to process your request"
            });
    }

}

async function loadProduct() {
//js walim url ekk get karana widiha
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.has("id")) {
        const productId = parameters.get("id");

        const response = await fetch("LoadSingleProduct?id=" + productId);

        if (response.ok) {
            const json = await response.json();
            console.log(json.product.id);


            const id = json.product.id;
            document.getElementById("image").src = "product-images/" + id + "/" + id + "image.png";


            document.getElementById("product-title").innerHTML = json.product.title;
            document.getElementById("product-title-1").innerHTML = json.product.title;
            document.getElementById("product-published-on").innerHTML = json.product.date_time;
            document.getElementById("product-qty").innerHTML = json.product.qty;
            document.getElementById("product-price").innerHTML = new Intl.NumberFormat(
                    "en-US",
                    {
                        minimumFractionDigits: 2
                    }

            ).format(json.product.price);
            document.getElementById("product-location").innerHTML = json.product.eventOn;

            document.getElementById("product-description").innerHTML = json.product.description;

//            *******************************
            document.getElementById("add-to-cart-main").addEventListener(
                    "click",
                    (e) => {
                addToCart(
                        json.product.id,
                        document.getElementById("add-to-cart-qty").value
                        );
                e.preventDefault();
            });

             let ProductHtml = document.getElementById("similer-product");
            document.getElementById("similer-product-main").innerHTML = "";
                            json.productList.forEach(item => {

                let productCloneHtml = ProductHtml.cloneNode(true);

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
            window.location = "index.html";
        }

    } else {
        window.location = "index.html";
    }
}

async function addToCart(id, qty) {
 const popup = Notification();
    const response = await fetch(
            "AddToCart?id=" + id + "&qty=" + qty + "",
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
                popup.success({

                message: json.content
            });
        }else{
               popup.success({

                message: "Quantiti Updated"
            });
        }

    } else {
        //document.getElementById("message").innerHTML = "Please try again later!";
           popup.error({

                message: "unable to process your request"
            });
    }

}
var eventList;

async function loadData() {
    const response = await fetch(
            "LoadFeatures",
            );
            
    if (response.ok) {
        const json = await response.json();
        console.log(json);
        const categoryList = json.categoryList;
        eventList = json.eventList;

        loadSelect("categorySelect", categoryList, "name");
        loadSelect("eventSelect", eventList, "name");
        
            updateProductView(json);

    } else {
        console.log("fail");
    }
}

function loadSelect(selectTagId, list, property) {
    const selectTag = document.getElementById(selectTagId);
    list.forEach(item => {
        let optionTag = document.createElement("option");
        optionTag.value = item.id;
        optionTag.innerHTML = item[property];
        selectTag.appendChild(optionTag);

    });

}
function updateEvents() {

    let modelSelectTag = document.getElementById("eventSelect");
    let selectedcategoryId = document.getElementById("categorySelect").value;
    modelSelectTag.length = 1;


    eventList.forEach(event => {
        if (event.category.id == selectedcategoryId) {
            let optionTag = document.createElement("option");
            optionTag.value = event.id;
            optionTag.innerHTML = event.name;
            modelSelectTag.appendChild(optionTag);
        }
    });

}

async function searchProducts1(firstResult) {
    const popup = Notification();
    //get search data

    let ev_select = document.getElementById("eventSelect");
    let  Event_name = ev_select.options[ev_select.selectedIndex].text;

    let sort_text = document.getElementById("st-sort").value;


    let  selectedText = document.getElementById("categorySelect");
    let  categorySelect = selectedText.options[selectedText.selectedIndex].text;

    console.log(sort_text);
    console.log(categorySelect);
    console.log(Event_name);



    //prrepare required data
   const data = {
    firstResult: firstResult,
    categorySelect: categorySelect,
    Event_name: Event_name,  // Change Event_name to brand_name
    sort_text: sort_text
};

    const response = await fetch(
            "SearchProducts1",
            {

                method: "POST",
                body: JSON.stringify(data),
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
            console.log(json);
            updateProductView(json);

        } else {
            popup.error({

                message: "unable to process your  ba"
            });
        }
    } else {
        popup.error({

            message: "unable to process your request"
        });
    }
}
let st_product = document.getElementById("st-product");
let st_pagination_button = document.getElementById("st-pagination-button");
var currentPage = 0;

function updateProductView(json) {
    //start:load Product List
    let st_product_container = document.getElementById("st-producr-container");

    st_product_container.innerHTML = "";

    json.productList.forEach(product => {
        let st_product_clone = st_product.cloneNode(true);

        //update details
        st_product_clone.querySelector("#st-product-a-1").href = "single_product_view.html?id=" + product.id;
        st_product_clone.querySelector("#st-product-img-1").src = "product-images/" + product.id + "/" + product.id + "image.png";
        st_product_clone.querySelector("#st-product-title-1").innerHTML = product.title;
        st_product_clone.querySelector("#st-product-location").innerHTML = product.eventOn;
        st_product_clone.querySelector("#st-product-date").innerHTML = product.date_time;
        st_product_clone.querySelector("#st-product-price-1").innerHTML = new Intl.NumberFormat(
                "en-US", {
                    minimumFractionDigits: 2
                }).format(product.price);
        
        //Update details
        st_product_container.appendChild(st_product_clone);
    });
    //end:load Producr

    //start pagination
    //load pagination
    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";

    let product_count = json.allProductCount;
    const product_per_page = 6;

    let pages = Math.ceil(product_count / product_per_page);

    //add previous arrow
    if (currentPage != 0) {
        let st_pagination_button_clone_prev = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_prev.innerHTML = "Prev";
        st_pagination_button_clone_prev.addEventListener("click", e => {
            currentPage--;
            searchProducts1(currentPage * 6);
        });
        st_pagination_container.appendChild(st_pagination_button_clone_prev);
    }


    //add page buttons
    for (let i = 0; i < pages; i++) {
        let st_pagination_button_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_clone.innerHTML = i + 1;

        st_pagination_button_clone.addEventListener("click", e => {
            currentPage = i;
            searchProducts1(i * 6);
        });

      

        st_pagination_container.appendChild(st_pagination_button_clone);
    }

    //add next arrow
    if (currentPage != (pages - 1)) {

        let st_pagination_button_clone_next = st_pagination_button.cloneNode(true);
        st_pagination_button_clone_next.innerHTML = "Next";
        st_pagination_button_clone_next.addEventListener("click", e => {
            currentPage++;
            searchProducts1(currentPage * 6);
        });
        st_pagination_container.appendChild(st_pagination_button_clone_next);
    }

}

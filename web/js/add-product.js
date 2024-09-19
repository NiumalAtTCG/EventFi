var eventList;

async function loadFeatures() {
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


async function productListing() {

    const categorySelectTag = document.getElementById("categorySelect");
    const eventSelectTag = document.getElementById("eventSelect");
    const titleTag = document.getElementById("title");
    const eventOnTag = document.getElementById("eventOn");
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    eventOnTag.textContent = formattedDate;


    const descriptionTag = document.getElementById("description");
    const priceTag = document.getElementById("price");
    const quantityTag = document.getElementById("quantity");
    const eventAtTag = document.getElementById("eventAt");
    const imageTag = document.getElementById("image");


    const data = new FormData();

    data.append("categoryId", categorySelectTag.value);
    data.append("eventId", eventSelectTag.value);
    data.append("title", titleTag.value);
    data.append("description", descriptionTag.value);
    data.append("eventOn", eventOnTag.value);
    data.append("eventAt", eventAtTag.value);
    data.append("price", priceTag.value);
    data.append("quantity", quantityTag.value);
    data.append("image", imageTag.files[0]);



    const response = await fetch(
            "AddProduct",
            {
                method: "POST",
                body: data
            }
    );
  const popup = Notification();

    if (response.ok) {
        const json = await response.json();
      
//        const messageTag = document.getElementById("message");
        if (json.success) {
            console.log(json.content);
            categorySelectTag.value = 0;
            eventSelectTag.length = 1;
            titleTag.value = "";
            descriptionTag.value = "";
            eventOnTag.value = "";
            eventAtTag.value = "0";
            priceTag.value = "";
            quantityTag.value = "0";
            imageTag.value = null;


//            messageTag.innerHTML = json.content;
//            messageTag.className = "text-success";
            popup.success({

                message: json.content
            });
        } else {
            popup.error({

                message: json.content
            });
//            messageTag.innerHTML = json.content;
//            messageTag.className = "text-danger";
        }
    } else {
        popup.error({

            message: " please try again later"
        });
        }
}
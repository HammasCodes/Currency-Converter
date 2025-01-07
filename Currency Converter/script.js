const BASE_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "From" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "To" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateflag(evt.target);
    });
}

const updateflag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;
    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}?amount=${amtval}&from=${fromCurr.value}&to=${toCurr.value}`;
    let response = await fetch(URL);

    if (!response.ok) {
        console.error("Failed to fetch exchange rates. Status:", response.status);
        return;
    }

    let data = await response.json();
    let rate = data.rates[toCurr.value]; // Correctly access the specific exchange rate
    console.log(`Exchange Rate: ${rate}`);

    // Perform the conversion and update the msg element with the result
    let convertedAmount = amtval * rate;
    msg.innerText = `${amtval} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;
});

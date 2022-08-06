import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from "./fetchCountries";
import './css/styles.css';

const inputRef = document.querySelector("#search-box");
const countryListFef = document.querySelector(".country-list");
const countryInfoFef = document.querySelector(".country-info");

const DEBOUNCE_DELAY = 300;
inputRef.addEventListener("input", debounce(onSearchBoxInput, DEBOUNCE_DELAY ));


function onSearchBoxInput(e) {
    countryListFef.innerHTML = "";
    countryInfoFef.innerHTML = "";
    const query = inputRef.value.trim();

    if (!query) {
        return
    }

    fetchCountries(query) 
        .then(countriesArray => {
            console.log(countriesArray);
            console.log(countriesArray.length);
            if (countriesArray.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
                return
            } else if (countriesArray.length >1 && countriesArray.length <11) {
                showCountriesList(countriesArray);
                return 
            } else if (countriesArray.length === 1) {
                showCountryCard(countriesArray);
                return
            } else if (countriesArray.length === 0 || countriesArray.length === undefined) {
                return Promise.reject('code 404'); 
            }
        }).catch(error => {
            if (error === "code 404") {
                Notify.failure("Oops, there is no country with that name");
            }
            console.log("error", error);
         })      
}

// 
function showCountriesList(countriesArray) {
    countryListFef.insertAdjacentHTML("beforeend", generateCountriesList(countriesArray));
}

function showCountryCard(countriesArray) {
    countryInfoFef.insertAdjacentHTML("beforeend", generateCountryCard(countriesArray));
}

function generateCountriesList(countriesArray) {
    const сountriesListMarkup = countriesArray.map(({ name, flags }) => 
    `<li class="country-item">
        ${flags.png ? `<img src="${flags.png}"` : `<img src="${flags.svg}"`} 
            alt ="Flag of ${name.official}"
            class = "country-pic"}>
        <p class="country-name">${name.official}</p>
    </li>`
    ).join(""); 
    return сountriesListMarkup;
}


function generateCountryCard(countriesArray) {
    const { name, flags, capital, population, languages } = countriesArray[0];
  
    const сountryCardMarkup =
        `<div class = "pic-wraper">
            ${flags.png ? `<img src="${flags.png}"` : `<img src="${flags.svg}"`}
                alt ="Flag of ${name.official}"
                class = "country-pic"}>
            <p class="country-name">${name.official}</p>
        </div>
            <p class="country-description">
                Capital:
                <span class = "span-text">${capital}</span>
            </p>
            <p class="country-description">
                Population:
                <span class = "span-text">${population}</span>
            </p>
            <p class="country-description">
                Languages:
                <span class = "span-text">${Object.values(languages)}</span>
            </p>`;
    return сountryCardMarkup;
}

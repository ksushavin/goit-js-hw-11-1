import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,languages,flags`)
        .then(response => {
            if (response.status === 404) {
                Notify.failure("Oops, there is no country with that name");
                return Promise.reject('not found');
            }
            return response.json();
        })
        .then(countriesArray => {
            return countriesArray
        })
        .catch (error => console.log("error", error))
}
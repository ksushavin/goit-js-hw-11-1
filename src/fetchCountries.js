
const URL = 'https://restcountries.com/';

export default function fetchCountries(name) {
   
    return fetch(`${URL}v3.1/name/${name}?fields=name,capital,population,languages,flags`)
    .then(response => response.json()
    )
}

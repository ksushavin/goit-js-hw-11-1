import axios from "axios";

const API_KEY = "29185241-cb51d998a1035b93afc10950d";
const BASE_URL = "https://pixabay.com/api/";

export default class PicsApiService {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
    };
    
    async getPics() {
        const options = {
            key: API_KEY ,
            q: this.searchQuery,
            image_type: "photo",
            orientation: "horizontal",
            per_page: 40,
            safesearch: true,
        }
    
        const URL = `${BASE_URL}?per_page=${options.per_page}&q=${options.q}&key=${options.key}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}`;

        const response = await axios.get(URL);
        return response.data;
    }
    
    resetPage() {
        this.page = 1;
    }
    incrementPage() {
        this.page += 1;
    }
    
    get guery() {
        return this.searchQuery;
    }
    set guery(newQuery) {
        this.searchQuery = newQuery;
    }
}

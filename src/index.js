
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PicsApiService from "./picApiService";
import './css/styles.css';

const refs = {
    searchForm: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more")
}

refs.searchForm.addEventListener("submit", onSearch);
refs.loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);

const picsApiService = new PicsApiService();

const simpleLightbox =  new SimpleLightbox('.gallery-link', {
    captionSelector: 'img',
    captionDelay: 250
});

async function onSearch(e) {
    e.preventDefault();
    const inputValue = e.currentTarget.elements.searchQuery.value.trim();

    // поміняла місцями перші дві умови і тепер умова 32 рядка не працює
    if (inputValue === picsApiService.query) {
        scrollPageUp();
        return
    } else if (!inputValue) {
        Notify.info("Please, enter your search query.");
        return
    } else {
        refs.gallery.innerHTML = "";
        hideLoadMoreBtn();
        picsApiService.query = inputValue;
        picsApiService.resetPage();
        try {
            const { hits, totalHits } = await picsApiService.getPics();
                if (hits.length === 0) {
                    Notify.failure("Sorry, there are no images matching your search query. Please try again.")
                    return 
                }
            clearGalleryContainer();
            appendPicsMarkup(hits);
            Notify.info(`Hooray! We found ${totalHits} images.`);
            simpleLightbox.refresh();
            countAndIncrementPages(totalHits);  
        } catch (error) {
            console.log(error)
        }
    }
}

async function onLoadMoreBtnClick() {
    const { hits, totalHits } = await picsApiService.getPics();

    try {
        appendPicsMarkup(hits);
        scrollByDown();
        simpleLightbox.refresh();
        countAndIncrementPages(totalHits) 
    } catch (error) {
        console.log(error)
    }  
}

function countAndIncrementPages(amount) {
    const pageAmount = Math.ceil(amount / 40);
    const currentPage = picsApiService.page;

        if (currentPage === pageAmount) {
            hideLoadMoreBtn();
            Notify.info("We're sorry, but you've reached the end of search results.");
            return
        }
        showLoadMoreBtn()
        picsApiService.incrementPage();
        return
}

function appendPicsMarkup(picsArray) {
    refs.gallery.insertAdjacentHTML("beforeend", creatPicsMarkup(picsArray));
}

function creatPicsMarkup(picsArray) {
    const picsMarkup = picsArray.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
    }) => 
        `<div class="photo-card">
                <a href="${largeImageURL}" class="gallery-link">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </div>
                </a>       
            </div>`
    ).join("")

    return picsMarkup
}

function clearGalleryContainer() {
    refs.gallery.innerHTML = "";
}

function hideLoadMoreBtn() {
    refs.loadMoreBtn.classList.add("is-hidden");
}
function showLoadMoreBtn() {
    refs.loadMoreBtn.classList.remove("is-hidden");
}
function scrollByDown() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 3,
        behavior: "smooth",
    }); 
}

// window.scroll(0, -window.innerHeight);
function scrollPageUp() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}




 
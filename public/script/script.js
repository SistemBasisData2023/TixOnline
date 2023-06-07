const movieDetailsPopup = document.getElementById('movieDetailsPopup');
const closeMovieDetailsBtn = document.getElementById('closeMovieDetailsBtn');
const movieTitleElement = document.getElementById('movieTitle');
const movieSynopsisElement = document.getElementById('movieSynopsis');
const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
const movieLinkElement = document.getElementById('movieLink');
        

function showMovieDetails(movieTitle, movieSynopsis, movieId) {
    const today = new Date();
    today.setHours(today.getHours() + 7);
    const date = today.toISOString().split('T')[0];
    
    movieTitleElement.textContent = movieTitle;
    movieSynopsisElement.textContent = movieSynopsis;
    movieLinkElement.setAttribute("href", "/schedules-movie/" + movieId + "?selectedCity=All&selectedDate=" + date);
    movieDetailsPopup.classList.remove('hidden');
    closeMovieDetailsBtn.addEventListener('click', () => {
    movieDetailsPopup.classList.add('hidden');
    });
    console.log(movieId);
}

function showMovieDetailsPopup() {
    var popup = document.getElementById("movieDetailsPopup");
    popup.classList.add("show");
}

function hideMovieDetailsPopup() {
    var popup = document.getElementById("movieDetailsPopup");
    popup.classList.remove("show");
}

// JavaScript code for smooth scrolling

// Smooth scroll to a target element
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth"
    });
    }
}

  // Attach click event listeners to navigation links
document.addEventListener("DOMContentLoaded", function() {
    const navigationLinks = document.querySelectorAll(".smooth-scroll");

    navigationLinks.forEach(function(link) {
        link.addEventListener("click", function(e) {
        e.preventDefault();
        const target = this.getAttribute("href");
        smoothScroll(target);
        });
    });
});

registerBtn.addEventListener('click', () => {
    registerModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    registerModal.classList.add('hidden');
});

loginBtn.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
});

closeLoginModalBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
});

function showPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
}

function hidePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}

function checkSession() {
    if (typeof session !== 'undefined' && session.hasOwnProperty('username') && session.username !== null) {
        return true;
    } else {
        return false;
    }
}
const movieDetailsPopup = document.getElementById('movieDetailsPopup');
const closeMovieDetailsBtn = document.getElementById('closeMovieDetailsBtn');
const movieTitleElement = document.getElementById('movieTitle');
const movieSynopsisElement = document.getElementById('movieSynopsis');
const movieActorsElement = document.getElementById('movieActors');
const movieTicketPriceElement = document.getElementById('movieTicketPrice');
const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
        

function showMovieDetails(movieTitle, movieSynopsis) {
// Set movie details based on the movieTitle parameter (you can customize this logic)
movieTitleElement.textContent = movieTitle;
movieSynopsisElement.textContent = movieSynopsis;
movieActorsElement.textContent = "Xolo Maridueña, Angel Manuel Soto";
movieTicketPriceElement.textContent = 'Ticket Price: $15';

            movieDetailsPopup.classList.remove('hidden');

            closeMovieDetailsBtn.addEventListener('click', () => {
                movieDetailsPopup.classList.add('hidden');
            });
}

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
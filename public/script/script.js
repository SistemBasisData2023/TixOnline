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
        

function showMovieDetails(movieTitle) {
// Set movie details based on the movieTitle parameter (you can customize this logic)
    if (movieTitle === 'fastX') {
                movieTitleElement.textContent = 'Fast & Furious X';
                movieSynopsisElement.textContent = "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted and outdriven every foe in their path. Now, they must confront the most lethal opponent they've ever faced. Fueled by revenge, a terrifying threat emerges from the shadows of the past to shatter Dom's world and destroy everything -- and everyone -- he loves.";
                movieActorsElement.textContent = "Star: Vin Diesel, Michelle Rodriguez, Tyrese Gibson, Chris 'Ludacris' Bridges, John Cena";
                movieTicketPriceElement.textContent = 'Ticket Price: $10';
            } else if (movieTitle === 'flash') {
                movieTitleElement.textContent = 'The Flash';
                movieSynopsisElement.textContent = "Worlds collide when the Flash uses his superpowers to travel back in time to change the events of the past. However, when his attempt to save his family inadvertently alters the future, he becomes trapped in a reality in which General Zod has returned, threatening annihilation. With no other superheroes to turn to, the Flash looks to coax a very different Batman out of retirement and rescue an imprisoned Kryptonian -- albeit not the one he's looking for.";
                movieActorsElement.textContent = "Ezra Miller, Sasha Calle, Michael Shannon, Ron Livingston, Maribel Verdú, Kiersey Clemons, Antje Traue, Michael Keaton";
                movieTicketPriceElement.textContent = 'Ticket Price: $12';
            } else if (movieTitle === 'johnWick') {
                movieTitleElement.textContent = 'John Wick: Chapter 4';
                movieSynopsisElement.textContent = "With the price on his head ever increasing, legendary hit man John Wick takes his fight against the High Table global as he seeks out the most powerful players in the underworld, from New York to Paris to Japan to Berlin.";
                movieActorsElement.textContent = 'Keanu Reeves, Donnie Yen, Rina Sawayama, Shamier Anderson, Lance Reddick, Ian McShane, Laurence Fishburne';
                movieTicketPriceElement.textContent = 'Ticket Price: $15';
            } else if (movieTitle === 'marvels') {
                movieTitleElement.textContent = 'The Marvels';
                movieSynopsisElement.textContent = 'Carol Danvers, aka Captain Marvel, has reclaimed her identity from the tyrannical Kree and taken revenge on the Supreme Intelligence. However, unintended consequences see her shouldering the burden of a destabilized universe. When her duties send her to an anomalous wormhole linked to a Kree revolutionary, her powers become entangled with two other superheroes to form the Marvels.';
                movieActorsElement.textContent = 'Brie Larson, Teyonah Parris, Iman Vellani, Zawe Ashton, Park Seo-joon, Samuel L. Jackson';
                movieTicketPriceElement.textContent = 'Ticket Price: $10';
            } else if (movieTitle === 'shazam') {
                movieTitleElement.textContent = 'Shazam! Fury of the Gods';
                movieSynopsisElement.textContent = 'Bestowed with the powers of the gods, Billy Batson and his fellow foster kids are still learning how to juggle teenage life with their adult superhero alter egos. When a vengeful trio of ancient gods arrives on Earth in search of the magic stolen from them long ago, Shazam and his allies get thrust into a battle for their superpowers, their lives, and the fate of the world.';
                movieActorsElement.textContent = 'Zachary Levi, Asher Angel, Jack Dylan Grazer, Helen Mirren, Lucy Liu, Rachel Zegler, Djimon Hounsou';
                movieTicketPriceElement.textContent = 'Ticket Price: $12';
            } else if (movieTitle === 'gotg3') {
                movieTitleElement.textContent = 'Guardians of the Galaxy Vol. 3';
                movieSynopsisElement.textContent = 'Still reeling from the loss of Gamora, Peter Quill must rally his team to defend the universe and protect one of their own. If the mission is not completely successful, it could possibly lead to the end of the Guardians as we know them.';
                movieActorsElement.textContent = 'Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel, Bradley Cooper, Pom Klementieff, Karen Gillan';
                movieTicketPriceElement.textContent = 'Ticket Price: $12';
            } else if (movieTitle === 'transformers') {
                movieTitleElement.textContent = 'Transformers: Rise of the Beasts';
                movieSynopsisElement.textContent = 'During the 1990s, the Maximals, Predacons and Terrorcons join the existing battle on Earth between Autobots and Decepticons.';
                movieActorsElement.textContent = 'Anthony Ramos, Dominique Fishback, Luna Lauren Velez, Ron Perlman, Peter Cullen, Frank Welker';
                movieTicketPriceElement.textContent = 'Ticket Price: $15';
            } else if (movieTitle === 'spiderman') {
                movieTitleElement.textContent = 'Spiderman Across the Spider-Verse';
                movieSynopsisElement.textContent = "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. However, when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders. He must soon redefine what it means to be a hero so he can save the people he loves most.";
                movieActorsElement.textContent = 'Shameik Moore, Hailee Steinfeld, Jake Johnson, Liev Schreiber, Oscar Isaac, Issa Rae, Brian Tyree Henry, Lauren Velez, Lily Tomlin';
                movieTicketPriceElement.textContent = 'Ticket Price: $10';
            } else if (movieTitle === 'oppenheimer') {
                movieTitleElement.textContent = 'Oppenheimer';
                movieSynopsisElement.textContent = "Physicist J Robert Oppenheimer works with a team of scientists during the Manhattan Project, leading to the development of the atomic bomb.";
                movieActorsElement.textContent = "Robert Downey Jr., Matt Damon, Emily Blunt, Meryl Streep, Rami Malek, Ben Mendelsohn, T.R. Knight, Colin Firth";
                movieTicketPriceElement.textContent = 'Ticket Price: $12';
            } else if (movieTitle === 'bluebeetle') {
                movieTitleElement.textContent = 'Blue Beetle';
                movieSynopsisElement.textContent = "Jaime Reyes suddenly finds himself in possession of an ancient relic of alien biotechnology called the Scarab. When the Scarab chooses Jaime to be its symbiotic host, he's bestowed with an incredible suit of armor that's capable of extraordinary and unpredictable powers, forever changing his destiny as he becomes the superhero Blue Beetle.";
                movieActorsElement.textContent = "Xolo Maridueña, Angel Manuel Soto";
                movieTicketPriceElement.textContent = 'Ticket Price: $15';
            }

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
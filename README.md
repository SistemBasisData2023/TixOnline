# TixOnline Cinema Booking App

## Contributors

Final Database Management System project by Group G7:

- [Handaneswari Pramudhyta Imanda](https://www.github.com/handaneswari) - 2106731346
- [Roy Oswaldha](https://www.github.com/rroiii) - 2106731592
- [Stefan Agusto Hutapea](https://www.github.com/stefanagusto) - 2106700744


## Introduction
TixOnline is a web-based cinema booking application developed using Node.js, Express, PostgreSQL, and EJS. It provides users with a seamless and convenient online platform to browse movies, view showtimes, and book tickets for their favorite films. With a robust backend powered by Node.js and Express, and a reliable database in PostgreSQL, TixOnline offers a smooth and secure cinema booking experience. The dynamic HTML views are generated using EJS (Embedded JavaScript), making the application visually appealing and interactive.

## Features

#### `User Registration and Authentication`

Enjoy personalized features by creating an account and logging in. TixOnline allows users to manage their profile, track booking history, and receive tailored recommendations. With secure authentication mechanisms in place, your personal information and account details are safe.

#### `Movie Browsing`

Discover an extensive collection of movies through TixOnline's intuitive interface. Explore detailed information about each movie, including plot summaries, genres, and ratings. Get a comprehensive overview and make informed choices about your movie selections.
![messageImage_1686501293185](https://github.com/SistemBasisData2023/TixOnline/assets/88542494/91da773f-604d-4d7f-9b1a-badf33e6200b)
![messageImage_1686501320818](https://github.com/SistemBasisData2023/TixOnline/assets/88542494/f4c93e34-cfe0-4b68-bf33-ba80f5b2b748)

#### `Ticket Booking`
TixOnline simplifies the ticket booking process, allowing users to effortlessly select their preferred movie, showtime, and seats. With a streamlined interface, you can confidently proceed to book tickets securely. The application ensures that seats are not double-booked, providing a hassle-free experience.
![message![messageImage_1686501378842](https://github.com/SistemBasisData2023/TixOnline/assets/88542494/c3ca7300-e24e-4a42-8961-701bf81e1766)
![messageImage_1686501270419](https://github.com/SistemBasisData2023/TixOnline/assets/88542494/371822bf-e761-4049-9013-a891f2a8c4f2)

#### `Booking History`

Easily access your past bookings with TixOnline's booking history feature. Stay organized by reviewing your previous movie choices, showtimes, and the seats you booked. Keep track of your cinema experiences and plan future outings with ease.
![messageImage_1686501358107](https://github.com/SistemBasisData2023/TixOnline/assets/88542494/988e7eca-efeb-430a-b1ba-83408e02a7a3)


## Tables

The following are tables used in the TixOnline's database.

### 1. `Admins`

This table stores information about administrators of the TixOnline application.

- admin_id
- username
- email
- password


### 2. `Movies`

This table stores information about movies available for booking.

- movie_id
- title
- genre
- duration
- release_date
- synopsis
- status
- trailer_link
- images
- rating

### 3. `Schedule`

This table stores information about movie schedules, including showtimes and prices.

- schedule_id
- movie_id
- studio_id
- date
- hours
- prices

### 4. `Seats`

This table stores information about seats in the studios.

- seat_id
- studio_id
- seat_number

### 5. `Schedules`

This table links schedules with their corresponding seats.

- schedule_id
- seat_id

### 6. `Studios`

This table stores information about movie studios.

- studio_id
- name
- type
- theater_id

### 7. `Theaters`

This table stores information about theaters where movies are shown.

- theater_id
- name
- address
- city
- theater_images

### 8. `Tickets`

This table stores information about tickets booked by users.

- ticket_id
- transaction_id
- schedule_id
- seat_id

### 9. `Transactions`

This table stores information about user transactions.

- transaction_id
- user_id
- quantity
- transaction_status
- transaction_date
- payment_max_date

### 10. `Remember me`

This table stores tokens for "Remember Me" functionality.

- remember_me_tokens_id
- user_id
- token
- expires_at

## Flowcharts
1. User Flowchart
<img width="3650" alt="user flowchart" src="https://github.com/SistemBasisData2023/TixOnline/assets/88542494/38e492cc-85b0-4db5-889a-1b84d7707c92">
2. Admin Flowchart
<img width="2015" alt="admin flowchart" src="https://github.com/SistemBasisData2023/TixOnline/assets/88542494/38f1f40b-a444-4997-a9a6-27eae7de8f30">


## Entity Relationship Diagram
<img width="6312" alt="ERD" src="https://github.com/SistemBasisData2023/TixOnline/assets/88542494/350fd5dc-2821-4954-9f75-b0a1fb109040">


## UML 
![UML SBD ](https://github.com/SistemBasisData2023/TixOnline/assets/88542494/d0154133-0ba2-47f0-a3ea-2d7470e175f8)

## Getting Started

To get started with TixOnline, follow these simple steps:

1. Clone the repository: `git clone https://github.com/SistemBasisData2023/TixOnline`
2. Install dependencies: `npm install`
3. Start the application: `npm start`
4. Visit `http://localhost:3000` in your browser to access TixOnline.

## Technologies Used

- Node.js 
- Express 
- PostgreSQL 
- EJS
- HTML
- CSS
- Tailwind
- JavaScript
- Libraries: Body-parser Paypal-rest-sdk bcrypt multer fs cookie-parser node-cron ejs pg

<p align="left"><a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a> </P>

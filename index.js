//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');
const bcrypt = require('bcrypt');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require('pg');

const port = 3000;



// Create a PostgreSQL connection pool
const db = new Client({
    user: 'rroiii',
    host: 'ep-patient-tree-136811.ap-southeast-1.aws.neon.tech',
    database: 'TixTicket',
    password: 'dNWTl39fJjCB',
    port: 5432,
    ssl:{rejectUnauthorized: false}, 
  });

  const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/');
    },
    filename: (req, file, callback) => {
        const extension = file.originalname.split('.').pop(); // Get the file extension
        const filename = req.body.title.toLowerCase().replace(/[^a-z0-9]/g, '-'); // Generate filename from the input
        callback(null, Date.now() + ' - ' + filename + '.' + extension);
    }
  });

  const fileFilter = (req,file,callback) => { 
    if(file.mimetype === 'image/png' || 
       file.mimetype === 'image/jpg' || 
       file.mimetype === 'image/jpeg'){
        callback(null, true);
    }else{
        callback(null, false);
    }
  }
  app.use(express.static('public'));
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'));
const upload = multer({ storage: fileStorage });
  // Configure PayPal Sandbox credentials
paypal.configure({
    mode : 'sandbox',
    client_id: 'AXGCErbNw-M4COGxcnG2NkdhhyHPJDqyyAC2NTwIemP7b7i0FXAwkWOI_4YC2nk2VIuF7XeKv6SfIlAZ',
    client_secret: 'EEuMnCqlUcqyAkK5zuW4GuYbjj4mJUY4dcB2v4dMuKcWObaPHKBT5aB3FXl2cCcVU2i27cWCOtGsvl5Z'
  });

//Melakukan koneksi dan menunjukkan indikasi database terhubung

//jalankan koneksi ke database
db.connect((err)=>{
    if (err) {
        console.log(err);
        return;
    }
    console.log("Database connected.");
});
 
//middleware (session)
app.use(
    session({
        secret: 'ini contoh secret',
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    })
);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

var store_session;
 
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//ROUTERS
//Landing page
router.get('/', async (req, res) => {
    try{
        const query = 'SELECT * FROM movies WHERE status = $1;'
    
        await db.query(query, ['SHOWING'], async (err, moviesShowing) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                const query = 'SELECT * FROM movies WHERE status = $1;';
        
                await db.query(query, ['UPCOMING'], (err, moviesUpcoming) => {
                    if(err){
                        console.log(err);
                        return res.json({ message: 'Retrive data failed.' });
                    }else{
                        console.log("This is /");
                        console.log(store_session);
                        res.render('home.ejs',{moviesShowing:moviesShowing.rows, moviesUpcoming:moviesUpcoming.rows});
                    }
                });
            }
        });

    }catch(err){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

router.get("/movie-test", async(req, res) => {

    try{
        const query = 'SELECT * FROM Movies WHERE status = $1;'

        await db.query(query, ['SHOWING'], async (err, movies) => {
            if(err){
                console.log('/movie-test - Getting data error');
            }else{
                console.log(movies.rows);
                const movieId = movies.rows[0].movie_id;
                const url = '/schedules/' + movieId;
                res.redirect(url);
            }
        });
    }catch(error){
    }
});

router.get("/schedules/:movieId", async(req, res) => {
    const {movieId} = req.params;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    try{
          const query = 'SELECT * FROM Movies WHERE status = $1;';

        await db.query(query, ['SHOWING'], async (err, movies) => {
            if(err){
                console.log('/schedules 1 - Getting data error');
            }else{
                const query = 'SELECT DISTINCT location FROM Studios;';
        
                await db.query(query, async (err, locations) => {

                    if(err){
                        console.log('/movie-test - Getting data error');
                    }else{
                        const query = 'SELECT * FROM Schedule JOIN Studios ON Schedule.studio_id = Studios.studio_id JOIN Movies ON Schedule.movie_id = Movies.movie_id WHERE Schedule.movie_id = $1;';
                        const values = [movieId];

                        await db.query(query, values, (err, results) => {
                            if(err){
                                console.log(err);
                                console.log('/schedules 2 - Getting data error');
                            }else{
                                
                                res.render('movie.ejs', {movies : movies.rows, schedules : results.rows, locations : locations.rows, nextWeek});
                            }
                        });
                    }
                });
            }
        });
        
    }catch(error){
    }
});

router.get('/admin/movies/add', async(req,res)=> {
    try{
        res.render('admin-movies-add.ejs');
    }catch(error){

    }
});

router.get('/admin/movies/edit/:id', async(req, res)=> {
    try{
        res.render('admin-movies-edit.ejs');
    }catch(error){

    }
});
router.get('/admin/movies', async (req, res) => {
    try{
        const query ='SELECT * FROM Movies;';

        await db.query(query, (err, results) => {
            if(err){

            }else{
                res.render('admin-movies.ejs', {movies : results.rows});
            }
        });

    }catch(error){
    }
});

router.post('/create-movie', async (req,res)=>{
    const { title, genre, duration, release_date, synopsis, status, trailer_link, rating} = req.body;
    console.log(req.body);
    const image = req.file.filename;

    try{
        const query = 'INSERT INTO Movies (title, genre, duration, release_date, synopsis, status, trailer_link, images, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);';
        const values = [title, genre, duration, release_date, synopsis, status, trailer_link, image, rating];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log("Making movie error.")
                console.log(err);
            }else{
                console.log("Movie created");
                res.redirect('/admin/movies');
            }
        });

    }catch(err){
        console.log(err);
    }
});

router.post('/delete-movie/:id', async (req,res)=>{
    const movie_id = req.params.id;
    try{
        const query = 'SELECT images FROM Movies WHERE movie_id = $1;';
        const values = [movie_id];

        await db.query(query, values, async (err, results) => {
            if(err){
                console.log(err);
                res.redirect('/admin/movies');
            }else{
                const filename = results.rows[0].images;
                const filePath = `public/images/${filename}`;

                fs.unlink(filePath, async (err) => {
                    if (err) {
                      console.error(err);
                      res.redirect('/admin/movies');
                    } else {
        
                      const query = 'DELETE FROM Movies WHERE movie_id = $1;';
                      const values = [movie_id];
              
                      await db.query(query, values, async (err, results) => {
                          if(err){
                              console.log(err);
                              res.redirect('/admin/movies');
                          }else{
                              console.log("deleted.")
                              res.redirect('/admin/movies');
                          }
                      });
                    }
                  });

             
            }
        });

    }catch(err){
        console.log(err);
    }
});

router.post('/pay', (req, res) => {
    const ticketQuantity = store_session.ticketQuantity;
    const ticketPricesString = JSON.stringify(store_session.ticketPrices);
    const totalString = JSON.stringify(store_session.ticketQuantity*store_session.ticketPrices);
    console.log("Ticket Quantity " + ticketQuantity + " price " + ticketPricesString + " total " + totalString);

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'
      },
      transactions: [{
        item_list: {
          items: [{
            name: 'Cinema Ticket',
            sku: 'ticket001',
            price: ticketPricesString,
            currency: 'USD',
            quantity: ticketQuantity
          }]
        },
        amount: {
          currency: 'USD',
          total: totalString
        },
        description: 'Payment for cinema ticket'
      }]
    };
  
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error(error.response);
      } else {
        console.log(payment.transactions);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  });
  
router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const totalString = JSON.stringify(store_session.ticketQuantity*store_session.ticketPrices);

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD',
          total: totalString
        }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        console.error(error.response);
      } else {
  
        console.log("This is /succes");
        const transaction_id = store_session.transaction_id;
        const transaction_status = 'DONE';
    
        try{
            const query = 'UPDATE transactions SET transaction_status = $1 WHERE transaction_id = $2;';
            const values = [transaction_status, transaction_id];
    
            await db.query(query, values, async (err,results) => {
                if(err){
                    console.log(err);
                }else{
                    //dapetin tiket blom
                    const queryTicket = 'SELECT Tickets.*, Studios.*, Schedule.date, Schedule.hours, Schedule.prices FROM Tickets JOIN Transactions ON Tickets.transaction_id = Transactions.transaction_id JOIN Schedule ON Tickets.schedule_id = Schedule.schedule_id JOIN Studios ON Studios.studio_id = Schedule.studio_id WHERE Tickets.transaction_id = $1;';
                    const valuesTicket = [transaction_id];

                    await db.query(queryTicket, valuesTicket, (err,results) => {
                        if(err){
                            console.log(err);
                        }else{
                            store_session.ticketQuantity = null;
                            store_session.ticketPrices = null;
                            store_session.transaction_id = null;
                            console.log(results.rows);
                            res.render('success.ejs', { payment, tickets:results.rows});
                            console.log("Transaction done.")
                        }
                    });
                    
                }
            });
        }catch(err){
            
        }
      }
    });
  });
  
  
router.get('/cancel', async (req, res) => {
    const transaction_id = store_session.transaction_id;

    const transaction_status = 'CANCELED';

    try{
        const query = 'UPDATE transactions SET transaction_status = $1 WHERE transaction_id = $2;';
        const values = [transaction_status, transaction_id];

        await db.query(query, values, (err,results) => {
            if(err){
                console.log(err);
            }else{
                store_session.ticketQuantity = null;
                store_session.ticketPrices = null;
                store_session.transaction_id = null;
                console.log("Transaction canceled.")
                res.render('cancel.ejs');
            }
        });
    }catch(err){

    }

});
  
//Showing seat layout page
router.get('/seat/:scheduleId', async (req, res) => {
    const {scheduleId} = req.params;
    store_session.schedule_id = scheduleId;

    try{
        //Get sold seats first
        const querySoldSeat = 'SELECT seat_id FROM ScheduleSeats WHERE schedule_id = $1;';
        const values = [scheduleId];
        const soldSeats = null;

        await db.query(querySoldSeat, values, async (err, soldSeats) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                //Get seats on selected schedule
                const query = 'SELECT Seats.*, Schedule.Schedule_id, Schedule.prices FROM Seats JOIN Schedule ON Schedule.studio_id = Seats.studio_id WHERE Schedule.schedule_id = $1;';

                await db.query(query, values, (err, results) => {
                    if(err){
                        console.log(err);
                        return res.json({ message: 'Retrive data failed.' });
                    }else{
                        store_session.ticketPrices = results.rows[0].prices;
                        res.render('seats.ejs', {seats : results.rows, scheduleId:scheduleId, soldSeats:soldSeats.rows});
                    }
                });
            }
        });

        
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    } 
});

//Selected seat API
router.post('/select-seat', async (req, res) => {
    const {seatsId, scheduleId} = req.body;
    store_session.ticketQuantity = seatsId.length;
    store_session.seats_id = seatsId;
    try{
        const query = 'INSERT INTO ScheduleSeats (schedule_id, seat_id) VALUES ($1, $2);';
        seatsId.forEach(async (seatId) => {
            const values = [scheduleId, seatId];
            await db.query(query, values, (err, results) => {
                if(err){
                    console.log(err);
                    return res.json({ message: 'Retrive data failed.' });
                }else{
                    console.log(store_session);
                    console.log("Selected seat received by server.");
                }
            });
        });
    }catch{
        console.error('Error select seat:', error);
        return res.status(500).json({ message: 'An error occurred during select seat.' });
    }
});

//Make transaction API
router.post('/transaction-waiting', async (req, res) => {
    const {quantity} = req.body;
    const user_id = store_session.user_id;
    const transaction_status = 'WAITING';
    const transaction_date = new Date();

    try{
        const query = 'INSERT INTO Transactions (user_id, quantity, transaction_status, transaction_date) VALUES ($1, $2, $3, $4) RETURNING transaction_id;';
        const values = [user_id, quantity, transaction_status, transaction_date];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
            }else{
                store_session.transaction_id = results.rows[0].transaction_id;
                console.log("Transaction is made");
            }
        });
 
    }catch(error){
        console.error('Error make transaction:', error);
        return res.status(500).json({ message: 'An error occurred during making transaction.' });
    }
});

//Make tickets API
//Bikin error
router.post('/ticket-waiting', async (req, res) => {
    console.log("tiket waiting");

    const {seatsId, scheduleId} = req.body;

    const transaction_id = store_session.transaction_id;

    try{
        const query='INSERT INTO Tickets (transaction_id, schedule_id, seat_id) VALUES ($1, $2, $3);';

        seatsId.forEach(async (seatId) => {
            const values = [transaction_id, scheduleId, seatId];
            console.log("ticket transaction id" + transaction_id);
            req.session.transaction_id = transaction_id;
            await db.query(query, values, (err, results) => {
                if(err){
                    console.log(err);
                    return res.json({ message: 'Making ticket failed.' });
                }else{
                    console.log("Ticket success.");
                }
            });
        });

    }catch(error){
        console.error('Error make ticket(s):', error);
        return res.status(500).json({ message: 'An error occurred during making ticket.' });
    }
});

//Delete selected seat API
router.delete('/delete-select-seat', async (req, res) => {
    const scheduleId = store_session.schedule_id;
    const seatsId = store_session.seats_id;
    try{
        const query = 'DELETE FROM ScheduleSeats WHERE schedule_id = $1 AND seat_id = $2;';
        seatsId.forEach(async (seatId) => {
            const values = [scheduleId, seatId];
            await db.query(query, values, (err, results) => {
                if(err){
                    console.log(err);
                    return res.json({ message: 'Retrive data failed.' });
                }else{
                    store_session.seats_id = null;
                    console.log("Selected seat deleted from server.");
                }
            });
        });
    }catch{
        console.error('Error select seat:', error);
        return res.status(500).json({ message: 'An error occurred during select seat.' });
    }
});


//Showing selected movie details include the schedules page
router.get('/detail/:location/:movieId', async (req, res) => {
    const {location, movieId} = req.params;

    try{
        const query = 'SELECT Schedule.*, Movies.*, Studios.* FROM Schedule  JOIN Movies ON Schedule.movie_id = Movies.movie_id JOIN Studios ON Schedule.studio_id = Studios.studio_id WHERE Studios.location = $1 AND Schedule.movie_id = $2;';
        const values = [location, movieId];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                const url = results.rows[0].trailer_link;
                const videoId = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/v\/|youtu\.be\/|\/embed\/|\/e\/|watch\?v=|v\/|e\/|youtu\.be\/|\/\d\/|\/v\/|embed\/|\/e\/)([\w-]{11})/);
                let extractedId;
                if (videoId && videoId.length > 1) {
                extractedId = videoId[1];
                console.log("Success extract video ID.");
                } else {
                console.log("Unable to extract video ID.");
                }

                console.log(store_session);
                res.render('detail.ejs', {schedules : results.rows, 
                    movieTitle : results.rows[0].title, 
                    movieVideo : extractedId,
                    movieGenre : results.rows[0].genre, 
                    movieDuration : results.rows[0].duration, 
                    movieReleaseDate : results.rows[0].release_date,
                    movieSynopsis : results.rows[0].synopsis,
                    moviePlayedAt : results.rows[0].location,
                    moviePlayedAtCity : results.rows[0].city,
                    username : req.session.username
                });
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Showing theaters list where the selected movie is playing page
router.get('/movie/:movieTitle', async (req,res) => {
    const {movieTitle} = req.params;

    try{
        const query = 'SELECT DISTINCT Studios.location, Movies.movie_id FROM Studios JOIN Schedule ON Studios.studio_id = Schedule.studio_id JOIN Movies ON Schedule.movie_id = Movies.movie_id WHERE Movies.title = $1;';
        const values = [movieTitle];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('movie-selected.ejs', {theaters : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Showing movies list page
router.get('/movies', async (req,res) => {
    try{
        const query = 'SELECT * FROM movies;'

        await db.query(query, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('movies-list.ejs', {movies : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Showing movies list that is playing on selected theater's location page
router.get('/theater/:location', async (req,res) => {
    const {location} = req.params;

    try{
        const query = 'SELECT DISTINCT Movies.*, Studios.location FROM Movies JOIN Schedule ON Movies.movie_id = Schedule.movie_id JOIN Studios ON Schedule.studio_id = Studios.studio_id WHERE Studios.location = $1;';
        const values = [location];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('theater-selected.ejs', {movies : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});
 
//Showing theaters location page
router.get('/theaters', async (req,res) => {
    try{
        const query = 'SELECT DISTINCT name, location, city FROM studios;'

        await db.query(query, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('theaters-list.ejs', {theaters : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Login page
router.get('/login-account', async (req, res) =>{
    try{
        res.render('login.ejs');

        console.log("Open /login");
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Login button API
router.post('/login', async (req, res) => {
    const { username, password} = req.body;

    try{
        const query = 'SELECT password FROM users WHERE username = $1';
        const values = [username];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);

                return res.json({ message: 'Error find password' });
            } else{
                const hash = results.rows[0].password;

                bcrypt.compare(password, hash, async (err, results) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error compare the string');
                    } else {
                        if(results){
                            req.session.username = username;
                            console.log("Login Successfull!");
                            const queryUsernameId = 'SELECT user_id FROM users WHERE username = $1;';
                            await db.query(queryUsernameId, [req.session.username], async(err, results) => {
                                if(err){

                                }else{
                                    store_session = req.session;
                                    store_session.user_id = results.rows[0].user_id;
                                    res.redirect('/');
                                }
                            });
                        }else{
                            console.log("Password wrong")
                        }
                    }
                });
            }
        });

        // true if the username and email  is available (no matching rows found), false otherwise
        
        console.log("Open /login");
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Register account page
router.get('/register-account', async (req, res) => {
    try{
        res.render('register.ejs', 
                {UsernameAvailability: true,
                 PhoneNumberAvailability:true,
                 EmailAvailability:true,
                 usernameRegexAllowed : true,
                 emailRegexAllowed : true,
                 passwordRegexAllowed : true,
                 phoneNumberRegexAllowed : true
                });

        console.log("Open /register");
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Register button API
router.post('/register', async (req, res) => {
    const { username, email, password, first_name, last_name, phone_number } = req.body;

    //Regex
    const usernameRegex = /^[a-zA-Z0-9_-]{8,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
    const phoneNumberRegex = /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;

    //allows usernames that consist of 8 to 30 characters, including uppercase and lowercase letters, numbers, underscores, and hyphens.
    const usernameRegexAllowed = usernameRegex.test(username);
    //Ensures that the email address contains a username part, followed by the "@" symbol, a domain part, and a valid top-level domain.
    const emailRegexAllowed = emailRegex.test(email);
    //At least one lowercase letter,  at least one uppercase letter, at least one digit, matches any combination of alphanumeric characters and special characters (non-whitespace) with a minimum length of 8.
    const passwordRegexAllowed = passwordRegex.test(password);
    //Allows variations such as the presence of a country code, parentheses around the area code, and the use of hyphens, dots, or spaces as separators.
    const phoneNumberRegexAllowed = phoneNumberRegex.test(phone_number);

    try{
        //Check username availability
        const UsernameAvailability = await checkUsernameAvailability(username);
        const PhoneNumberAvailability = await checkPhoneNumberAvailability(phone_number);
        const EmailAvailability = await checkEmailAvailability(email);

        console.log(UsernameAvailability);
        console.log(EmailAvailability);
        console.log(PhoneNumberAvailability);

        //Username is not already taken
        if((UsernameAvailability == true) && (EmailAvailability == true) && (PhoneNumberAvailability == true) && (usernameRegexAllowed == true) && (emailRegexAllowed == true) && (passwordRegexAllowed == true) && (phoneNumberRegexAllowed == true)){
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    //Hash failed
                    res.status(500).send('Error hashing the string');

                } else {
                    // Insert new user into the database
                    const query = `INSERT INTO users (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6);`
                    const values = [username, email, hash, first_name, last_name, phone_number];
                    console.log(hash);
                    await db.query(query, values, (err, results) => {
                        if(err){
                            console.log(err);
                            return res.json({ message: 'Insert account data failed' });
                        } else{
                            // Set session data for the registered user
                            store_session = req.session;
                            store_session.user_id = req.body.user_id;
                            console.log("Register Successfull!");
                            res.redirect('/');
                        }
                    });
                }
            });
        }else{
            res.status(500);
            res.render('register.ejs', 
                {UsernameAvailability: await checkUsernameAvailability(username),
                 PhoneNumberAvailability: await checkPhoneNumberAvailability(phone_number),
                 EmailAvailability: await checkEmailAvailability(email),
                 usernameRegexAllowed : usernameRegex.test(username),
                 emailRegexAllowed : emailRegex.test(email),
                 passwordRegexAllowed : passwordRegex.test(password),
                 phoneNumberRegexAllowed : phoneNumberRegex.test(phone_number)
                });
        }

    }catch(error){
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'An error occurred during registration.' });
    }
  });

//FUNCTION
//Function to check wether the username is already taken or not
async function checkUsernameAvailability(username) {
    try {
      // Query the table for the specified username
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await db.query(query, values);

      // Return true if the username is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return false;
      }else{
        return true;
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false; // Return false in case of an error
    }
}

 //Function to check wether the email is already taken or not
 async function checkEmailAvailability(email) {
    try {
      // Query the table for the specified email
      const query = 'SELECT * FROM users WHERE email = $1';
      const values = [email];
      const result = await db.query(query, values);

      // Return true if the email is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return false;
      }else{
        return true;
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false; // Return false in case of an error
    }
}
  //Function to check wether the phone number is already taken or not
  async function checkPhoneNumberAvailability(phone_number) {
    try {
      // Query the table for the specified username
      const query = 'SELECT * FROM users WHERE phone_number = $1';
      const values = [phone_number];
      const result = await db.query(query, values);

      // Return true if the phone number is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return false;
      }else{
        return true;
      }
    } catch (error) {
      console.error('Error checking phone number availability:', error);
      return false; // Return false in case of an error
    }
  }

   //Function to check wether the email is already taken or not
 async function checkEmailAdminAvailability(email) {
    try {
      // Query the table for the specified email
      const query = 'SELECT * FROM Admins WHERE email = $1';
      const values = [email];
      const result = await db.query(query, values);
  
      // Return true if the email is available (no matching rows found), false otherwise
      return result.rowCount === 0;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false; // Return false in case of an error
    }
  }
  
      //Function to check wether the username is already taken or not
      async function checkUsernameAdminAvailability(username) {
        try {
          const query = 'SELECT * FROM Admins WHERE username = $1';
          const values = [username];
          const result = await db.query(query, values);
      
          // Return true if the username is available (no matching rows found), false otherwise
          return result.rowCount === 0;
        } catch (error) {
          console.error('Error checking username availability:', error);
          return false; // Return false in case of an error
        }
      }
      

  //Register Admin 
router.get('/registerAdmin_Account', async (req, res) => {
    try {
      res.render('registerAdmin.ejs', {
        UsernameAvailability: true,
        EmailAvailability: true,
        usernameRegexAllowed: true,
        emailRegexAllowed: true,
        passwordRegexAllowed: true,
      });
      console.log("Open /registerAdmin");
    } catch (error) {
      console.error('Page is not available', error);
      return res.status(500).json({ message: 'An error occurred while showing the page.' });
    }
  });
  
  router.post('/registerAdmin', async (req, res) => {
    const { username, email, password } = req.body;
  
    // Regex
    const emailAdminRegex = /^[A-Za-z0-9._%+-]+@tix\.gmail\.com$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{8,30}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
  
    // Check if the input values match the regex patterns
    const usernameRegexAllowed = usernameRegex.test(username);
    console.log(usernameRegexAllowed);
    const emailRegexAllowed = emailAdminRegex.test(email);
    console.log(emailRegexAllowed);
    const passwordRegexAllowed = passwordRegex.test(password);
    console.log(passwordRegexAllowed);
  
    try {
    // Check username availability
      const UsernameAvailability = await checkUsernameAdminAvailability(username);
      console.log("Username:");
      console.log(UsernameAvailability);
    const EmailAvailability = await checkEmailAdminAvailability(email);
    console.log("Email:");
    console.log(EmailAvailability);
  
      // Check if all conditions for registration are met
      if (
        (UsernameAvailability == true ) &&
        (EmailAvailability == true) &&
        (emailRegexAllowed == true) &&
        (passwordRegexAllowed == true) &&
        (usernameRegexAllowed == true)
      ) {
        console.log("Test");
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            // Hash failed
            return res.status(500).send('Error hashing the string');
          }
          // Insert new user into the database
          const query = `INSERT INTO Admins (username, email, password ) VALUES ($1, $2, $3);`;
          const values = [username, email, hash];
  
          try {
            await db.query(query, values);
            console.log("Register Successful!");
  
            // Set session data for the registered user
            req.session.username = username;
            return res.json({ message: 'Registration successful.' });
          } catch (error) {
            console.log(error);
            return res.json({ message: 'Insert account data failed' });
          }
        });
      } else {
        res.status(500);
        res.render('registerAdmin.ejs', {
          UsernameAvailability: await checkUsernameAvailability(username),
          emailAdminRegex: emailAdminRegex.test(email),
          passwordRegexAllowed: passwordRegex.test(password),
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'An error occurred during registration.' });
    }
  });

//Log in Admin 
router.get('/loginAdmin_account', async (req, res) =>{
    try{
        res.render('loginAdmin.ejs');

        console.log("Open /loginAdmin");
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Login button API
router.post('/loginAdmin', async (req, res) => {
    const { username, password} = req.body;

    try{
        const query = 'SELECT password FROM Admins WHERE username = $1';
        const values = [username];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);

                return res.json({ message: 'Error find password' });
            } else{
                const hash = results.rows[0].password;

                bcrypt.compare(password, hash, async (err, results) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error compare the string');
                    } else {
                        if(results){
                            req.session.username = username;
                            console.log("Login Successfull!");
                            const queryUsernameId = 'SELECT admin_id FROM Admins WHERE username = $1;';
                            await db.query(queryUsernameId, [req.session.username], async(err, results) => {
                                if(err){
                                console.log(err);
                                }else{
                                    console.log(results.rows[0].user_id);
                                    store_session = req.session;
                                    store_session.user_id = results.rows[0].admin_id;
                                    res.redirect('/');
                                }
                            });
                        }else{
                            console.log("Password wrong")
                        }
                    }
                });
            }
        });

        // true if the username and email  is available (no matching rows found), false otherwise
        console.log("Open /loginAdmin");
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Payment recap 
//function to get all purchases
async function getAllPurchases() {
    try {
      const query = 'SELECT * FROM Transactions';
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error retrieving purchase information:', error);
      return [];
    }
  }

  async function fetchPurchaseInformation() {
    try {
      // Check admin authorization here if needed
  
      const purchases = await getAllPurchases();
  
      if (purchases.length === 0) {
        console.log('No purchase information available.');
      } else {
        console.log('Purchase Information:');
        purchases.forEach((purchase) => {
          console.log('Transaction ID:', purchase.transaction_id);
          console.log('User ID:', purchase.user_id);
          console.log('Transaction Date:', purchase.transaction_date);
          console.log('Transaction Status:', purchase.transaction_status);
          console.log('------------------------');
        });
      }
    } catch (error) {
      console.error('Error fetching purchase information:', error);
    }
  }
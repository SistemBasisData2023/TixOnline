//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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
        saveUninitialized: false,
        resave: false
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

var temp;
 
app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static("public"));
app.set("view engine", "ejs");


//ROUTERS
//Landing page
router.get('/', (req, res) => {
    try{
        res.render('home.ejs');
    }catch(err){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

router.get('/movies/:movieId', async (req,res) => {
    const {movieId} = req.params;

    try{
        const query = 'SELECT DISTINCT Studios.* FROM Studios JOIN Schedule ON Studios.studio_id = Schedule.studio_id JOIN Movies ON Schedule.movie_id = Movies.movie_id WHERE Movies.movie_id = $1;';
        const values = [movieId];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('theaters.ejs', {theaters : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

router.get('/movies', async (req,res) => {
    try{
        const query = 'SELECT * FROM movies;'

        await db.query(query, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('movies.ejs', {movies : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

router.get('/theaters/:theaterId', async (req,res) => {
    const {theaterId} = req.params;

    try{
        const query = 'SELECT DISTINCT Movies.* FROM Movies JOIN Schedule ON Movies.movie_id = Schedule.movie_id JOIN Studios ON Schedule.studio_id = Studios.studio_id WHERE Studios.studio_id = $1;';
        const values = [theaterId];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('movies.ejs', {movies : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

router.get('/theaters', async (req,res) => {
    try{
        const query = 'SELECT * FROM studios;'

        await db.query(query, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Retrive data failed.' });
            }else{
                res.render('theaters.ejs', {theaters : results.rows});
            }
        });
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

router.post('/book', async (req,res) => {
    try{
        //const query = `INSERT INTO Bookings (user_id, movie_id, studio_id, seat_id, booking_date) VALUES (1, 1, 1, 2, CURRENT_DATE);`
        //const value = [user_id, movie_id, studio_id, seat_id, booking_date];

        await db.query(query, value, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Insert book failed' });
            } else{
                console.log("Book made!");
            }
        });

        const query =   `UPDATE Seats
                        SET is_available = false
                        WHERE studio_id = 1
                        AND seat_number = 2
                        AND EXISTS (
                            SELECT 1
                            FROM Schedule
                            WHERE studio_id = 1
                            AND date = '2023-05-27'
                            AND hours = 18
                        );`

        const value = [studio_id, seat_number, date, hours];
        
        await db.query(query, value, (err, results) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Update seats failed' });
            } else{
                console.log("Seat updated");
            }
        });


    }catch(error){
        console.error('Error during booking:', error);
        return res.status(500).json({ message: 'An error occurred during booking.' });
    }
});

router.get('/login-account', async (req, res) =>{
    try{
        res.render('login.ejs');

        console.log("Open /login");
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

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
                console.log(results);
                bcrypt.compare(password, hash, async (err, results) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error compare the string');
                    } else {
                        if(results){
                            req.session.username = username;
                            return res.json({ message: 'Account found.' });
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
                            console.log("Register Successfull!");
                        }
                    });
    
                    // Set session data for the registered user
                    temp = req.session;
                    temp.username = req.body.username;
    
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
 async function checkEmailAvailability_Admin(email) {
    try {
      // Query the table for the specified email
      const query = 'SELECT * FROM Admins WHERE email = $1';
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

// ADMIN 
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
    const emailRegexAllowed = emailAdminRegex.test(email);
    const passwordRegexAllowed = passwordRegex.test(password);
  
    try {
      // Check username availability
      const UsernameAvailability = await checkUsernameAvailability(username);
      const EmailAvailability = await checkEmailAvailability_Admin(email);
  
      console.log(UsernameAvailability);
      console.log(EmailAvailability);
  
      // Check if all conditions for registration are met
      if (
        UsernameAvailability &&
        EmailAvailability &&
        emailRegexAllowed &&
        passwordRegexAllowed&&
        usernameRegexAllowed
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
            console.log("Test");
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
  

  
//import packages
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");

//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require("pg");
const { render } = require("ejs");
const e = require("express");
const { Console } = require("console");
app.use(cookieParser());
const port = 3000;

// Create a PostgreSQL connection pool
const db = new Client({
  user: "rroiii",
  host: "ep-patient-tree-136811.ap-southeast-1.aws.neon.tech",
  database: "TixTicket",
  password: "dNWTl39fJjCB",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

//Cost to store file storage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images/");
  },
  filename: (req, file, callback) => {
    // Get the file extension
    const extension = file.originalname.split(".").pop();
    // Generate filename from the input
    const filename = req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    callback(null, Date.now() + " - " + filename + "." + extension);
  },
});

//Const to filter file that uploaded to server. Only png, jpg, and jpeg accepted
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

//Allow multer to access public folder
app.use(express.static("public"));

//Initialize the app to use multer
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//Configure PayPal Sandbox credentials
paypal.configure({
  mode: "sandbox",
  client_id:
    "AXGCErbNw-M4COGxcnG2NkdhhyHPJDqyyAC2NTwIemP7b7i0FXAwkWOI_4YC2nk2VIuF7XeKv6SfIlAZ",
  client_secret:
    "EEuMnCqlUcqyAkK5zuW4GuYbjj4mJUY4dcB2v4dMuKcWObaPHKBT5aB3FXl2cCcVU2i27cWCOtGsvl5Z",
});

//Connect to database
db.connect((err) => {
  if (err) {
    console.log("Error connect database : " + err);
    return;
  }
  console.log("Database connected.");
});

//Middleware (session)
app.use(
  session({
    secret: "ini contoh secret",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Middleware to check if the user is logged in
app.use(async (req, res, next) => {
  const rememberToken = req.cookies.remember_token;

  if (rememberToken) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM remember_me_tokens WHERE remember_token = $1 AND expires_at > NOW()",
        [rememberToken]
      );
      client.release();

      if (result.rows.length === 1) {
        req.user = result.rows[0];
      }
    } catch (err) {
      console.error("Error during remember me:", err);
    }
  }

  next();
});

// '* * * * *' run every 1 minute
// '*/5 * * * *' run every 5 minute
//Update transaction status to CANCELED if transaction status is WAITING and transaction date is more than 10 minute
// cron.schedule("*/5 * * * *", async () => {
//   try {
//     //Get transaction that are waiting and transaction date is more than 10 minute
//     db.query(
//       `
//       UPDATE transactions
//       SET transaction_status = 'CANCELED'
//       WHERE transaction_status = 'WAITING' AND transaction_date >= NOW() - INTERVAL '10 minutes' RETURNING transaction_id;`,
//       (err, transactions) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Transaction statuses updated successfully.");
//           //Get transaction details seats for each transaction
//           transactions.rows.forEach(async (transaction) => {
//             const query = "SELECT schedule_id, seats_ids FROM transactions_details_seats WHERE transaction_id = $1;";
//             const values = [transaction.transaction_id];

//             await db.query(query, values, async (err, results) => {
//               if (err) {
//                 console.log("Getting schedule_id and seats_ids failed : " + err);
//               } else {
//                 //Update seats status to AVAILABLE for each seats
//                 results.rows[0].seats_ids.forEach(async (seatId) => {
//                   const queryDelete = "DELETE FROM ScheduleSeats WHERE schedule_id = $1 AND seat_id = $2;";
//                   const values = [results.rows.schedule_id, seatId];

//                   await db.query(queryDelete, values, (err, results) => {
//                     if (err) {
//                       console.log("Delete schedule and seats failed : " + err);
//                     } else {
//                       console.log("Seat deleted.");
//                     }
//                   });
//                 });
//               }
//             });
//           });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// });

app.use(express.urlencoded({ extended: false }));

//Variable to store session of user
var store_session;

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//ROUTERS
//Landing page
router.get("/", async (req, res) => {
  try {
    //Get movie list that are showing right now
    const query = "SELECT * FROM movies WHERE status = $1;";

    await db.query(query, ["SHOWING"], async (err, moviesShowing) => {
      if (err) {
        console.log("(/) Error on getting data showing movies : " + err);
        return;
      } else {
        //Get movie list that are upcoming
        const query = "SELECT * FROM movies WHERE status = $1;";

        await db.query(query, ["UPCOMING"], (err, moviesUpcoming) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Retrive data failed." });
          } else {
            //Open home.ejs
            return res.status(200).render("home.ejs", {
              moviesShowing: moviesShowing.rows,
              moviesUpcoming: moviesUpcoming.rows,
              session: store_session,
            });
          }
        });
      }
    });
  } catch (err) {
    console.error("(/) Page is not availible", error);
    return res.status(500).json({ message: "An error occurred during showing page." });
  }
});

//Showing theaters page
router.get("/theaters", async (req, res) => {
    //City filter
    const { selectedCity } = req.query;
    try {
        //Get list of cities
        const query = "SELECT DISTINCT city FROM Theaters;";

        await db.query(query, async (err, cities) => {
            if (err) {
                //If error, redirect to home page
                console.log("(/theaters) Getting data cities error : " + err);
                return res.status(500).redirect("/");
            } else {
                //Add "All" to cities list
                cities.rows.unshift({ city: "All" });
                //Get list of theaters
                let queryTheaters = "SELECT * FROM Theaters";

                //If user choose city, add WHERE clause to query
                if (selectedCity && selectedCity !== "All") {
                    queryTheaters += ` WHERE Theaters.city = '${selectedCity}'`;
                }
                
                queryTheaters += ";";

                await db.query(queryTheaters, (err, results) => {
                    if (err) {
                        //If error, redirect to home page
                        console.log("(/theaters) Getting data theaters error : " + err);
                        return res.status(500).redirect("/");
                    } else {
                        //Get current date
                        const today = new Date();
                        //Set today to +7 hours because in indonesia GMT +7
                        today.setHours(today.getHours() + 7);
                        //Extract the date only
                        const date = today.toISOString().split("T")[0];
                        //Get first movie on the list to be default if user havent choose what movie
                    
                        return res.status(200).render("theaters.ejs", {
                            cities: cities.rows,
                            cityFilter: selectedCity,
                            session: store_session,
                            theaters: results.rows,
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Showing schedules on selected theater
router.get("/schedules-theater/:theaterId", async (req, res) => {
    //Theater id
    const { theaterId } = req.params;
    //City filter and date filter
    const { selectedCity, selectedDate } = req.query;

    const today = new Date();
    //Set today to +7 hours because in indonesia GMT +7
    today.setHours(today.getHours() + 7);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    console.log(today);
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    var dateArray = []; // Initialize the array

    //Get next 7 days
    for (var i = 0; i < 7; i++) {
        var nextDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        var dateString = nextDate.toISOString().split("T")[0];

        var [year, monthNumber, day] = dateString.split("-");
        var month = monthNames[nextDate.getMonth()];

        var dateObject = {
            year: parseInt(year),
            month: month,
            day: parseInt(day),
            date: dateString,
        };
        dateArray.push(dateObject);
    }

    try {
        //Get list of cities
        const queryCity = "SELECT DISTINCT city FROM Theaters;";
        await db.query(queryCity, async (err, cities) => {
            if (err) {
                console.log("(/schedules-theater )- Getting data cities error : " + err);
                return res.status(500).redirect("/");
            } else {
                let city = cities.rows[0].city;

                //If user choose city, set city to selected city, if not, set city to first city on the list
                if (selectedCity) {
                    city = selectedCity;
                } else {
                    city = cities.rows[0].city;
                }

                //Get list of theaters on selected city
                const query = "SELECT * FROM Theaters  WHERE city = $1;";

                await db.query(query, [city], async (err, theaters) => {
                    if (err) {
                        console.log("(/schedules-theater) - Getting data theaters on selected city error" + err);
                        return res.status(500).redirect("/");
                    } else {
                        //Get selected theater data
                        const queryTheater = "SELECT * FROM Theaters WHERE theater_id = $1;";
                        const values = [theaterId];
                        await db.query(queryTheater, values, async (err, theater) => {
                            if (err) {
                                console.log("(/schedules-theater) - Getting data selected theater  error" + err);
                                return res.status(500).redirect("/");
                            } else {
                                let date = today;

                                if (selectedDate) {
                                date = selectedDate;
                                } else {
                                date = today.toISOString().split("T")[0];
                                }

                                //Get schedules on selected theater and selected date
                                let querySchedule = `SELECT * FROM Schedule JOIN Studios ON Schedule.studio_id = Studios.studio_id JOIN Movies ON Schedule.movie_id = Movies.movie_id JOIN Theaters ON Studios.theater_id = Theaters.theater_id WHERE Theaters.theater_id = '${theaterId}' AND Schedule.date ='${date}'`;

                                //If user choose city, add WHERE clause to query
                                if (selectedCity && selectedCity !== "All") {
                                    querySchedule += ` AND Theaters.city = '${city}'`;
                                }
                                
                                querySchedule += "ORDER BY type, hours ASC;";

                                //Get schedules
                                await db.query(querySchedule, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        console.log("/schedules - Getting data error");
                                    } else {
                                        res.render("theaters-list.ejs", {
                                        theaters: theaters.rows,
                                        theater: theater.rows[0],
                                        schedules: results.rows,
                                        cities: cities.rows,
                                        nextWeek,
                                        session: store_session,
                                        dateSelector: dateArray,
                                        cityFilter: selectedCity,
                                        dateFilter: selectedDate,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Movie page that redirect to /schedules
router.get("/movies", async (req, res) => {
    try {
        //Get movie list that are showing right now
        const query ="SELECT * FROM Movies WHERE status = $1 ORDER BY movie_id ASC;";

        await db.query(query, ["SHOWING"], async (err, movies) => {
        if (err) {
            console.log("(/movies) Error on getting data showing movies : " + err);
            return res.status(500).redirect("/");
        } else {
            //Get current date
            const today = new Date();
            //Set today to +7 hours because in indonesia GMT +7
            today.setHours(today.getHours() + 7);
            //Extract the date only
            const date = today.toISOString().split("T")[0];
            //Get first movie on the list to be default if user havent choose what movie
            const movieId = movies.rows[0].movie_id;
            //Redirect to /schedules/
            const url = "/schedules-movie/" + movieId + "?selectedCity=All&selectedDate=" + date;
            return res.status(200).redirect(url);
        }
        });
    }catch (error) {
        console.error("(/movies) Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Showing schedules on selected movie
router.get("/schedules-movie/:movieId", async (req, res) => {
    //Movie id
    const { movieId } = req.params;
    //City filter and date filter
    const { selectedCity, selectedDate } = req.query;

    const today = new Date();
    //Set today to +7 hours because in indonesia GMT +7
    today.setHours(today.getHours() + 7);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    console.log(today);
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    var dateArray = []; // Initialize the array

    //Get next 7 days
    for (var i = 0; i < 7; i++) {
        var nextDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        var dateString = nextDate.toISOString().split("T")[0];

        var [year, monthNumber, day] = dateString.split("-");
        var month = monthNames[nextDate.getMonth()];

        var dateObject = {
            year: parseInt(year),
            month: month,
            day: parseInt(day),
            date: dateString,
        };
        dateArray.push(dateObject);
    }

    try {
        //Get movie list that are showing right now
        const query = "SELECT * FROM Movies WHERE status = $1;";

        await db.query(query, ["SHOWING"], async (err, movies) => {
            if (err) {
                //If error, redirect to home page
                console.log("(/schedules-movie) Getting data movies error : " + err);
                return res.status(500).redirect("/");
            } else {
                //Get list of cities
                const query = "SELECT DISTINCT city FROM Theaters;";

                await db.query(query, async (err, cities) => {
                    if (err) {
                        //If error, redirect to home page
                        console.log("(/schedules-movie) Getting data cities error : " + err);
                        return res.status(500).redirect("/");
                    } else {
                        //Add "All" to cities list
                        cities.rows.unshift({ city: "All" });

                        //Get selected movie data
                        const queryMovie = "SELECT * FROM Movies WHERE movie_id = $1;";
                        const values = [movieId];
                        await db.query(queryMovie, values, async (err, movie) => {
                            if (err) {
                                //If error, redirect to home page
                                console.log("(/schedules-movie) Getting data cities error : " + err);
                                return res.status(500).redirect("/");
                            } else {
                                //Get video id from youtube link
                                const url = movie.rows[0].trailer_link;
                                //Get video id from youtube link
                                const videoId = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/v\/|youtu\.be\/|\/embed\/|\/e\/|watch\?v=|v\/|e\/|youtu\.be\/|\/\d\/|\/v\/|embed\/|\/e\/)([\w-]{11})/);
                                let extractedId;
                                //If video id is found, set extractedId to video id
                                if (videoId && videoId.length > 1) {
                                    extractedId = videoId[1];
                                    console.log("Success extract video ID.");
                                } else {
                                    console.log("Unable to extract video ID.");
                                }

                                let date = today;
                                //If user choose date, set date to selected date, if not, set date to today
                                if (selectedDate) {
                                    date = selectedDate;
                                } else {
                                    date = today.toISOString().split("T")[0];
                                }

                                //Get schedules on selected movie and selected date
                                let querySchedule = `SELECT * FROM Schedule JOIN Studios ON Schedule.studio_id = Studios.studio_id JOIN Movies ON Schedule.movie_id = Movies.movie_id JOIN Theaters ON Studios.theater_id = Theaters.theater_id WHERE Schedule.movie_id = '${movieId}' AND Schedule.date ='${date}'`;

                                //If user choose city, add WHERE clause to query
                                if (selectedCity && selectedCity !== "All") {
                                    querySchedule += ` AND Theaters.city = '${selectedCity}'`;
                                }

                                querySchedule += "ORDER BY type, hours ASC;";

                                await db.query(querySchedule, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        console.log("/schedules - Getting data error");
                                    } else {
                                        res.render("movie.ejs", {
                                            movies: movies.rows,
                                            movie: movie.rows[0],
                                            schedules: results.rows,
                                            cities: cities.rows,
                                            nextWeek,
                                            movieVideo: extractedId,
                                            session: store_session,
                                            dateSelector: dateArray,
                                            cityFilter: selectedCity,
                                            dateFilter: selectedDate,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});
//ADMIN MAIN DASHBOARD PAGES
//Page for admin dashboard
router.get("/admin/dashboard", async (req, res) => {
    try {
        //Get total prices of all transactions that are completed and not canceled from transactions_details_seats
        const queryTotal = "SELECT SUM(total_prices) FROM transactions_details_seats WHERE transaction_status = 'DONE';";
        await db.query(queryTotal, async (err, totalPrices) => {
            if(err){
                console.log("(/admin/dashboard) Getting data total prices error : " + err);
                return res.status(500).redirect("/");
            }else{ 
                //Order movies by total transaction from highest to lowest and limit to 5 movies only from transactions_details_seats
                const queryMovie = "SELECT title, SUM(total_prices) AS earning, SUM(quantity) AS quantity FROM transactions_details_seats WHERE transaction_status = 'DONE' GROUP BY title ORDER BY SUM(quantity) DESC;";
                await db.query(queryMovie, async (err, movies) => {
                    if(err){
                        console.log("(/admin/dashboard) Getting data movies error : " + err);
                        return res.status(500).redirect("/");
                    }else{
                        console.log(movies.rows);
                        console.log(totalPrices.rows[0].sum);
                        return res.status(200).render("admin-dashboard.ejs", { movies: movies.rows, totalPrices: totalPrices.rows[0].sum });
                    }
                });
            }
        });
    }catch(error){
        console.log("page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//ADMIN Schedule ROUTER & PAGES
//Page for schedules list
router.get("/admin/schedules", async (req, res) => {
    try {
        //Get schedules list join with movie, studio, and theater
        const query =
        "SELECT Schedule.*, Movies.title, Studios.name AS studio_name, Studios.type, Theaters.* FROM Schedule JOIN Movies ON Schedule.movie_id = Movies.movie_id JOIN Studios ON Schedule.studio_id = Studios.studio_id JOIN Theaters ON Studios.theater_id = Theaters.theater_id ORDER BY schedule_id ASC;";

        await db.query(query, (err, results) => {
            if (err) {
                console.log("(/admin/schedules) Getting data schedule erro : " + err);  
                //Belum ditambahin /admin
            } else {
                //Open admin-schedules.ejs
                //Belum ditambahin role admin
                res.render("admin-schedules.ejs", { schedules: results.rows });
            }
        });
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for add schedules
router.get("/admin/schedules/add", async (req, res) => {
    try {
        //Get list of movies for dropdown
        const queryMovie = "SELECT * FROM Movies;";
        await db.query(queryMovie, async (err, movies) => {
            if (err) {
                console.log("(/admin/schedules/add) Getting data movies error : " + err);
            } else {
                //Get list of cities for dropdown
                const queryCity = "SELECT DISTINCT city FROM Theaters;";
                await db.query(queryCity, async (err, cities) => {
                    if (err) {
                        console.log("(/admin/schedules/add) Getting data cities error : " + err);
                    } else {
                        //Get list of theaters for dropdown
                        const queryTheater = "SELECT * FROM Theaters;";
                        await db.query(queryTheater, async (err, theaters) => {
                            if (err) {
                                console.log("(/admin/schedules/add) Getting data theaters error : " + err);
                            } else {
                                //Get list of studios for dropdown
                                const queryStudio = "SELECT * FROM Studios;";
                                await db.query(queryStudio, async (err, studios) => {
                                    if (err) {
                                        console.log("(/admin/schedules/add) Getting data studios error : " + err);
                                    } else {
                                        //Get current date + 3 days as minimum date to create schedule
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 3);
                                        const minDate = tomorrow.toISOString().split("T")[0];

                                        res.render("admin-schedules-add.ejs", {
                                            movies: movies.rows,
                                            theaters: theaters.rows,
                                            studios: studios.rows,
                                            cities: cities.rows,
                                            minDate,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API to create schedule
router.post("/create-schedule", async (req, res) => {
    const { movie, studio, date, hours, prices } = req.body;

    try {
        //Insert schedule data to database
        const query =
        "INSERT INTO Schedule (movie_id, studio_id, date, hours, prices) VALUES ($1, $2, $3, $4, $5);";
        const values = [movie, studio, date, hours, prices];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Create schedule failed : " + err)
            } else {
                console.log("Schedule created");
                return res.status(200).redirect("/admin/schedules");
            }
        });
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page to edit schedules
router.get("/admin/schedules/edit/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const query = "SELECT * FROM Schedule WHERE schedule_id = $1;";
    await db.query(query, [scheduleId], async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        //Get list of movies for dropdown
        const queryMovie = "SELECT * FROM Movies;";
        await db.query(queryMovie, async (err, movies) => {
          if (err) {
            console.log(err);
          } else {
            //Get list of cities for dropdown
            const queryCity = "SELECT DISTINCT city FROM Theaters;";
            await db.query(queryCity, async (err, cities) => {
              if (err) {
                console.log(err);
              } else {
                //Get list of theaters  for dropdown
                const queryTheater = "SELECT * FROM Theaters;";
                await db.query(queryTheater, async (err, theaters) => {
                  if (err) {
                    console.log(err);
                  } else {
                    //Get list of studios for dropdown
                    const queryStudio = "SELECT * FROM Studios;";
                    await db.query(queryStudio, async (err, studios) => {
                      if (err) {
                        console.log(err);
                      } else {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 3);
                        const minDate = tomorrow.toISOString().split("T")[0];

                        res.render("admin-schedules-edit.ejs", {
                          schedule: results.rows[0],
                          movies: movies.rows,
                          theaters: theaters.rows,
                          studios: studios.rows,
                          cities: cities.rows,
                          minDate,
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {}
});

//API to edit schedules
router.post("/edit-schedule/:id", async (req, res) => {
    const schedule_id = req.params.id;
    const { movie, studio, date, hours, prices } = req.body;
    try {
        let query = "UPDATE schedule SET";
        const updateFields = [];

        //If user input data, add to updateFields array
        if (movie) {
            updateFields.push(`movie_id = '${movie}'`);
        }
        if (studio) {
            updateFields.push(`studio_id = '${studio}'`);
        }
        if (date) {
            updateFields.push(`date = '${date}'`);
        }
        if (hours) {
            updateFields.push(`hours = '${hours}'`);
        }
        if (prices) {
            updateFields.push(`prices = '${prices}'`);
        }
        query += ` ${updateFields.join(", ")} WHERE schedule_id = ${schedule_id};`;

        await db.query(query, (err, results) => {
            if (err) {
                console.log("Edit data schedule failed : ", err);
            } else {
                console.log("Data schedule edited.");
                return res.status(200).redirect("/admin/schedules");
            }
        });
    } catch (error) {
        console.log("Edit data schedule failed : " + error);
        return res.status(500).redirect("/admin/schedules");
    }
});

//API to delete schedule
router.post("/delete-schedule/:id", async (req, res) => {
    //Schedule id
    const schedule_id = req.params.id;

    try {
        //Delete schedule
        const query = "DELETE FROM schedule WHERE schedule_id = $1;";
        const values = [schedule_id];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Delete schedule failed : " + err);
                return res.status(500).redirect("/admin/schedules");
            } else {
                console.log("Schedule deleted.");
                return res.status(200).redirect("/admin/schedules");
            }
        });
    } catch (error) {
        console.log("Delete schedule failed : " + error);
        return res.status(500).redirect("/admin/schedules");
    }
});

//ADMIN Seats ROUTER & PAGES
//Page for seats list
router.get("/admin/seats", async (req, res) => {
    try {
        //Get seats list join with studio and theater
        const query = "SELECT seats.*, studios.name AS studio_name, studios.type, theaters.* FROM Seats JOIN Studios ON Seats.studio_id = Studios.studio_id JOIN Theaters ON Studios.theater_id = Theaters.theater_id ORDER BY seat_id ASC;";

        await db.query(query, (err, results) => {
            if (err) {
                console.log("(/admin/seats) Getting data seats error : " + err);
            } else {
                res.render("admin-seats.ejs", { seats: results.rows });
            }
        });
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for add seats
router.get("/admin/seats/add", async (req, res) => {
    try {
        //Get list of cities from theaters
        const queryCity = "SELECT DISTINCT city FROM Theaters;";
        await db.query(queryCity, async (err, cities) => {
            if (err) {
                console.log("(/admin/seats/add) Getting data cities error : " + err);
                return res.status(500).redirect("/admin/seats");
            } else {
                //get list of theaters
                const queryTheaters = "SELECT * FROM Theaters;";
                await db.query(queryTheaters, async (err, theaters) => {
                    if (err) {
                        console.log("(/admin/seats/add) Getting data theaters error : " + err);
                        return res.status(500).redirect("/admin/seats");
                    } else {
                        //get list of studios
                        const queryStudios = "SELECT * FROM Studios;";
                        await db.query(queryStudios, async (err, studios) => {
                            if (err) {
                                console.log("(/admin/seats/add) Getting data studios error : " + err);
                                return res.status(500).redirect("/admin/seats");
                            } else {
                                res.status(200).render("admin-seats-add.ejs", {
                                    cities: cities.rows,
                                    theaters: theaters.rows,
                                    studios: studios.rows,
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API to create seat
router.post("/create-seat", async (req, res) => {
    const { studio, seatNumber } = req.body;
    try {
        //Insert seat data to database
        const query = "INSERT INTO Seats (studio_id, seat_number) VALUES ($1, $2);";
        const values = [studio, seatNumber];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Making seat error : " + err);
                return res.status(500).redirect("/admin/seats");
            } else {
                console.log("Seat created");
                res.status(200).redirect("/admin/seats");
            }
        });
    } catch (error) {
        console.log("Create seat failed : " + error);
        return res.status(500).redirect("/admin/seats");
    }
});

//Page for edit seats
router.get("/admin/seats/edit/:seatId", async (req, res) => {
    const { seatId } = req.params;
    try {
        //Get seat data from database based on seat id from params 
        const query = "SELECT * FROM Seats WHERE seat_id = $1;";

        await db.query(query, [seatId], async (err, results) => {
            if (err) {
                console.log(err);
            } else {
                //Get list of cities from theaters for dropdown
                const queryCity = "SELECT DISTINCT city FROM Theaters;";
                await db.query(queryCity, async (err, cities) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //get list of theaters for dropdown
                        const queryTheaters = "SELECT * FROM Theaters;";
                        await db.query(queryTheaters, async (err, theaters) => {
                            if (err) {
                                console.log(err);
                            } else {
                                //get list of studios for dropdown
                                const queryStudios = "SELECT * FROM Studios;";
                                await db.query(queryStudios, async (err, studios) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.render("admin-seats-edit.ejs", {
                                            seat: results.rows[0],
                                            cities: cities.rows,
                                            theaters: theaters.rows,
                                            studios: studios.rows,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API to edit seats
router.post("/edit-seat/:id", async (req, res) => {
    const seat_id = req.params.id;
    const { studio, seatNumber } = req.body;
    console.log("edit data");

    try {
        let query = "UPDATE seats SET";
        const updateFields = [];

        //If user input data, add to updateFields array
        if (studio) {
            updateFields.push(`studio_id = '${studio}'`);
        }
        if (seatNumber) {
            updateFields.push(`seat_number = '${seatNumber}'`);
        }

        query += ` ${updateFields.join(", ")} WHERE seat_id = ${seat_id};`;

        await db.query(query, (err, results) => {
            if (err) {
                console.log("Edit data seat failed : ", err);
                return res.status(500).redirect("/admin/seats");
            } else {
                console.log("Data seat edited.");
                return res.status(500).redirect("/admin/seats");
            }
        });
    } catch (error) {
        console.log("Edit data seat failed : " + error);
        return res.status(500).redirect("/admin/seats");
    }
});

//API to delete seat
router.post("/delete-seat/:id", async (req, res) => {
    //Seat id
    const seat_id = req.params.id;

    try {
        //Delete seat
        const query = "DELETE FROM seats WHERE seat_id = $1;";
        const values = [seat_id];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Delete seat failed : ", err);
                return res.status(500).redirect("/admin/seats");
            } else {
                console.log("Seat deleted.");
                return res.status(200).redirect("/admin/seats");
            }
        });
    } catch (error) {
        console.log("Delete seat failed : " + error);
        return res.status(500).redirect("/admin/seats");
    }
});

//ADMIN Theaters ROUTER & PAGES
//Page for theaters list
router.get("/admin/theaters", async (req, res) => {
    try {
        const query = "SELECT * FROM Theaters ORDER BY theater_id ASC;";

        await db.query(query, (err, results) => {
            if (err) {
                console.log("(/admin/theaters) Getting data theaters error : " + err);
            } else {
                res.render("admin-theaters.ejs", { theaters: results.rows });
            }
        });
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for add theaters
router.get("/admin/theaters/add", async (req, res) => {
    try {
        res.render("admin-theaters-add.ejs");
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for edit theaters
router.get("/admin/theaters/edit/:theaterId", async (req, res) => {
    const { theaterId } = req.params;

    try {
        //Get theater data from database based on theater id from params
        const query = "SELECT * FROM theaters WHERE theater_id = $1;";

        await db.query(query, [theaterId], (err, results) => {
            if(err){
                console.log(err);
            }else{
                res.render('admin-theaters-edit.ejs',{theater : results.rows[0]});
            }
        });
    } catch (error) {
        console.log("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API to create theater
router.post("/create-theater", async (req, res) => {
    const { name, address, city } = req.body;
    const image = req.file.filename;

    try {
        //Insert theater data to database
        const query =
        "INSERT INTO Theaters (name, address, city, theater_images) VALUES ($1, $2, $3, $4);";
        const values = [name, address, city, image];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Create theater failed : " + err);
                return res.status(500).redirect("/admin/theaters");
            } else {
                console.log("Theater created");
                res.status(200).redirect("/admin/theaters");
            }
        });
    } catch (err) {
        console.log("Create theater failed : " + err);
        return res.status(500).redirect("/admin/theaters");
    }
});

//API to delete movie
router.post("/delete-theater/:id", async (req, res) => {
    const theater_id = req.params.id;

    try {
        //Get theater photo name
        const query = "SELECT theater_images FROM Theaters WHERE theater_id = $1;";
        const values = [theater_id];

        await db.query(query, values, async (err, results) => {
            if (err) {
                console.log(err);
                res.redirect("/admin/theaters");
            } else {
                //Get theater photo name
                const filename = results.rows[0].theater_images;
                const filePath = `public/images/${filename}`;

                //Delete theater photo
                fs.unlink(filePath, async (err) => {
                    if (err) {
                        console.log("Delete theater photo failed : " + err);
                        return res.status(500).redirect("/admin/theaters");
                    } else {
                        //Delete theater data from database based on theater id from params
                        const query = "DELETE FROM theaters WHERE theater_id = $1;";
                        const values = [theater_id];

                        await db.query(query, values, async (err, results) => {
                            if (err) {
                                console.log("Delete theater failed : " + err);
                                return res.status(500).redirect("/admin/theaters");
                            } else {
                                console.log("deleted.");
                                return res.status(200).redirect("/admin/theaters");
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log("Delete theater failed : " + err);
        return res.status(500).redirect("/admin/theaters");
    }
});

//API to edit theaters
router.post("/edit-theater/:id", async (req, res) => {
    const theater_id = req.params.id;
    const { name, address, city } = req.body;

    try {
        let query = "UPDATE theaters SET";

        const updateFields = [];

        //If user input data, add to updateFields array
        if (name) {
            const escapedName = name.replace(/'/g, "''"); // Escape single quotes
            updateFields.push(`name = '${escapedName}'`);
        }
        if (address) {
            updateFields.push(`address = '${address}'`);
        }
        if (city) {
            updateFields.push(`city = '${city}'`);
        }
        if (req.file) {
            const image = req.file.filename;
            updateFields.push(`theater_images = '${image}'`);

            //Delete previous photo
            //Get theater photo name
            const queryDeletePhoto =
                "SELECT theater_images FROM theaters WHERE theater_id = $1;";
            const values = [theater_id];

            await db.query(queryDeletePhoto, values, async (err, results) => {
                if (err) {
                    console.log(err);
                    res.redirect("/admin/theaters");
                } else {
                    const filename = results.rows[0].images;
                    const filePath = `public/images/${filename}`;

                    //Delete theater photo
                    fs.unlink(filePath, async (err) => {
                        if (err) {
                            console.log("Delete theater photo failed : " + err);
                            return res.status(500).redirect("/admin/theaters");
                        } else {
                            console.log("Photo deleted.");
                        }
                    });
                }
            });
        }

        query += ` ${updateFields.join(", ")} WHERE theater_id = ${theater_id};`;
        console.log(query);

        await db.query(query, (err, results) => {
            if (err) {
                console.log("Edit data failed : " + err);
                return res.status(500).redirect("/admin/theaters");
            } else {
                console.log(query);
                console.log("Data edited.");
                res.status(200).redirect("/admin/theaters");
            }
        });
    } catch (err) {
        console.log("Edit data failed : " + err);
        return res.status(500).redirect("/admin/theaters");
    }
});

//ADMIN STUDIOS ROUTER & PAGES
//Page for show studios list
router.get("/admin/studios", async (req, res) => {
    try {
        const query =
        "SELECT Studios.*, Theaters.name AS theater_name, theaters.city, theaters.address FROM Studios JOIN Theaters ON theaters.theater_id = studios.theater_id ORDER BY studio_id ASC;";
        await db.query(query, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("admin-studios.ejs", { studios: results.rows });
            }
        });
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for add studios
router.get("/admin/studios/add", async (req, res) => {
    try {
        //Get list of cities from theaters for dropdown
        const queryCity = "SELECT DISTINCT city FROM Theaters;";
        await db.query(queryCity, async (err, cities) => {
            //Get theaters list for dropdown
            const queryTheaters = "SELECT * FROM Theaters";
            await db.query(queryTheaters, async (err, theaters) => {
                if(err){
                    console.log(err);
                }else{
                    res.render('admin-studios-add.ejs', {cities : cities.rows, theaters : theaters.rows});
                }
            });
        });
    } catch (error) {
        console.log("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API for add studios
router.post("/create-studio", async (req, res) => {
    const { name, type, theater } = req.body;

    try {
        //Insert data to Studios table
        const query =
        "INSERT INTO Studios (name, type, theater_id) VALUES ($1, $2, $3);";
        const values = [name, type, theater];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Making studio error :" + err);
                return res.status(500).redirect("/admin/studios");
            } else {
                console.log("Studio created");
                res.status(200).redirect("/admin/studios");
            }
        });
    } catch (err) {
        console.log("Create studio failed : " + err);
        return res.status(500).redirect("/admin/studios");
    }
});

//Page for edit studios
router.get("/admin/studios/edit/:studioId", async (req, res) => {
    const { studioId } = req.params;
    try {
        //Get list of cities from theaters for dropdown
        const queryCity = "SELECT DISTINCT city FROM Theaters;";
        await db.query(queryCity, async (err, cities) => {
            //Get theaters list for dropdown
            const queryTheaters = "SELECT * FROM Theaters";
            await db.query(queryTheaters, async (err, theaters) => {
                if (err) {
                    console.log("(/admin/studios/edit) Getting data theaters error : " + err);
                    return res.status(500).redirect("/admin/studios");
                } else {
                    //Get studio data based on studioId
                    const query = "SELECT * FROM Studios WHERE studio_id = $1;";
                    const values = [studioId];
                    await db.query(query, values, async (err, studio) => {
                        if (err) {
                            console.log("(/admin/studios/edit) Getting data studios error : " + err);
                            return res.status(500).redirect("/admin/studios");
                        } else {
                            res.render("admin-studios-edit.ejs", {
                                cities: cities.rows,
                                theaters: theaters.rows,
                                studio: studio.rows[0],
                            });
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.log("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API for edit studios
router.post("/edit-studio/:id", async (req, res) => {
    const studio_id = req.params.id;
    const { name, type, theater } = req.body;

    try {
        let query = "UPDATE Studios SET";

        const updateFields = [];
        //If user input data, add to updateFields array
        if (name) {
            updateFields.push(`name = '${name}'`);
        }
        if (type) {
            updateFields.push(`type = '${type}'`);
        }
        if (theater) {
            updateFields.push(`theater_id = '${theater}'`);
        }

        query += ` ${updateFields.join(", ")} WHERE studio_id = ${studio_id};`;
        await db.query(query, (err, results) => {
            if (err) {
                console.log("Edit data failed : ", err);
                return res.status(500).redirect("/admin/studios");
            } else {
                console.log(query);
                console.log("Data edited.");
                return res.status(200).redirect("/admin/studios");
            }
        });
    } catch (err) {
        console.log("Edit data failed : " + err);
        return res.status(500).redirect("/admin/studios");
    }
});

//API for delete studios
router.post("/delete-studio/:id", async (req, res) => {
    const studio_id = req.params.id;

    try {
        const query = "DELETE FROM Studios WHERE studio_id = $1;";
        const values = [studio_id];

        await db.query(query, values, (err, results) => {
        if (err) {
            console.log("Delete studio failed : ", err);
            return res.status(500).redirect("/admin/studios");
        } else {
            console.log("deleted.");
            return res.status(200).redirect("/admin/studios");
        }
        });
    } catch (err) {
        console.log("Delete studio failed : " + err);
        return res.status(500).redirect("/admin/studios");
    }
});

//ADMIN MOVIES ROUTERS & PAGES
//Page for add movies
router.get("/admin/movies/add", async (req, res) => {
    try {
        res.render("admin-movies-add.ejs");
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for edit movies
router.get("/admin/movies/edit/:movieId", async (req, res) => {
    const { movieId } = req.params;
    try {
        const query = "SELECT * FROM Movies WHERE movie_id = $1;";

        await db.query(query, [movieId], (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("admin-movies-edit.ejs", { movie: results.rows[0] });
            }
        });
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Page for movies list
router.get("/admin/movies", async (req, res) => {
    try {
        const query = "SELECT * FROM Movies ORDER BY movie_id ASC;";

        await db.query(query, (err, results) => {
            if(err){

            }else{
                const username = req.query.username;
                res.render('admin-movies.ejs', {movies : results.rows, username : username});
            }
        });
    } catch (error) {
        console.error("Page is not availible" + error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//API to create movies
router.post("/create-movie", async (req, res) => {
    const {name,genre,duration,release_date,synopsis,status,trailer_link,rating} = req.body;
    console.log(req.body);
    const image = req.file.filename;

    try {
        const query =
        "INSERT INTO Movies (title, genre, duration, release_date, synopsis, status, trailer_link, images, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
        const values = [name,genre, duration, release_date, synopsis, status, trailer_link, image, rating, ];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log("Create movie failed : " + err);
                return res.status(500).redirect("/admin/movies");
            } else {
                console.log("Movie created");
                return res.status(200).redirect("/admin/movies");
            }
        });
    } catch (err) {
        console.log("Create movie failed : " + err);
        return res.status(500).redirect("/admin/movies");
    }
});

//API to edit movies
router.post("/edit-movie/:id", async (req, res) => {
    const movie_id = req.params.id;
    const {name,genre,duration,release_date,synopsis,status,trailer_link,rating} = req.body;
    try {
        let query = "UPDATE Movies SET";

        const updateFields = [];

        if (name) {
        const escapedTitle = name.replace(/'/g, "''"); // Escape single quotes
        updateFields.push(`title = '${escapedTitle}'`);
        }
        if (genre && genre !== "None") {
        updateFields.push(`genre = '${genre}'`);
        }
        if (duration) {
        updateFields.push(`duration= '${duration}'`);
        }
        if (release_date) {
        updateFields.push(`release_date = '${release_date}'`);
        }
        if (synopsis) {
        updateFields.push(`synopsis = '${synopsis}'`);
        }
        if (status && status !== "None") {
        updateFields.push(`status = '${status}'`);
        }
        if (trailer_link) {
        updateFields.push(`trailer_link = '${trailer_link}'`);
        }
        if (rating) {
        updateFields.push(`rating = '${rating}'`);
        }
        if (req.file) {
            const image = req.file.filename;
            updateFields.push(`images = '${image}'`);

            //Delete previous photo

            const queryDeletePhoto = "SELECT images FROM Movies WHERE movie_id = $1;";
            const values = [movie_id];

            await db.query(queryDeletePhoto, values, async (err, results) => {
                if (err) {
                    console.log("Delete movie photo failed : " + err);
                    return res.status(500).redirect("/admin/movies");
                } else {
                    const filename = results.rows[0].images;
                    const filePath = `public/images/${filename}`;

                    fs.unlink(filePath, async (err) => {
                        if (err) {
                            console.error("Delete movie photo failed : " + err);
                            return res.status(500).redirect("/admin/movies");
                        } else {
                            console.log("Photo deleted.");
                        }
                    });
                }
            });
        }

        query += ` ${updateFields.join(", ")} WHERE movie_id = ${movie_id};`;
        console.log(query);
        await db.query(query, (err, results) => {
            if (err) {
                console.log("Edit data failed : ", err);
                return res.status(304).redirect("/admin/movies");
            } else {
                console.log(query);
                console.log("Data edited.");
                return res.status(200).redirect("/admin/movies");
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).redirect("/admin/movies");
    }
});

//API to delete movie
router.post("/delete-movie/:id", async (req, res) => {
  const movie_id = req.params.id;

    try {
        const query = "SELECT images FROM Movies WHERE movie_id = $1;";
        const values = [movie_id];

        await db.query(query, values, async (err, results) => {
            if (err) {
                console.log(err);
                res.redirect("/admin/movies");
            } else {
                const filename = results.rows[0].images;
                const filePath = `public/images/${filename}`;

                fs.unlink(filePath, async (err) => {
                    if (err) {
                        console.log("Delete movie movie : " + err);
                        return res.status(500).redirect("/admin/movies");
                    } else {
                        const query = "DELETE FROM Movies WHERE movie_id = $1;";
                        const values = [movie_id];

                        await db.query(query, values, async (err, results) => {
                            if (err) {
                                console.log("Delete movie failed : " + err);
                                return res.status(500).redirect("/admin/movies");
                            } else {
                                console.log("deleted.");
                                return res.status(200).redirect("/admin/movies");
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
  }
});

//Make transaction API
router.post("/transaction-waiting", async (req, res) => {
    const { quantity } = req.body;
    const user_id = store_session.user_id;
    const transaction_status = "WAITING";
    let date = new Date();
    let date_10min = new Date();
    const transaction_date = date;
    date_10min.setMinutes(date_10min.getMinutes() + 10);
    const max_payment_date = date_10min;
    console.log(max_payment_date);
    console.log("/transaction-waiting" + store_session);
    try {
        const query =
        "INSERT INTO Transactions (user_id, quantity, transaction_status, transaction_date, payment_max_date) VALUES ($1, $2, $3, $4, $5) RETURNING transaction_id;";
        const values = [user_id, quantity, transaction_status, transaction_date, max_payment_date];

        await db.query(query, values, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                store_session.transaction_id = results.rows[0].transaction_id;
                console.log("Transaction is made");
            }
        });
    } catch (error) {
        console.error("Error make transaction:", error);
        return res.status(500).json({ message: "An error occurred during making transaction." });
    }
});

//Make tickets API
//Bikin error
router.post("/ticket-waiting", async (req, res) => {
    console.log("tiket waiting");

    const { seatsId, scheduleId } = req.body;

    const transaction_id = store_session.transaction_id;

    try {
        const query =
        "INSERT INTO Tickets (transaction_id, schedule_id, seat_id) VALUES ($1, $2, $3);";

        seatsId.forEach(async (seatId) => {
            const values = [transaction_id, scheduleId, seatId];
            console.log("ticket transaction id" + transaction_id);
            req.session.transaction_id = transaction_id;
            await db.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Making ticket failed." });
                } else {
                    console.log("Ticket success.");
                }
            });
        });
    } catch (error) {
        console.error("Error make ticket(s):", error);
        return res.status(500).json({ message: "An error occurred during making ticket(s)." });
    }
});

router.post("/pay-later", async (req, res) => {
    const {transaction_id} = req.body;
    try{
        const query = "SELECT payout_link FROM payout WHERE transaction_id = $1;";
        const values = [transaction_id];

        await db.query(query, values, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).redirect("/");
            }else{
                const payout_link = results.rows[0].payout_link;
                console.log(payout_link);
                return res.status(200).redirect(payout_link);
            }
        });
    }catch(error){
        console.log("Pay later failed : " + error);
        return res.status(500).redirect("/");
    }
});

router.post("/pay", (req, res) => {
    console.log("This is /pay" + store_session);
    console.log("This is /pay" );
    console.log(store_session);
    const { pay_button_clicked, quantity, total_prices, transaction_id} = req.body;
    let ticketQuantity;
    let ticketPricesString;
    let totalString;

    console.log("ini di /pay" + store_session.transaction_id);
    if(pay_button_clicked){
        ticketQuantity = quantity;
        ticketPricesString = total_prices;
        totalString = JSON.stringify(quantity * total_prices);
        store_session.transaction_id = transaction_id;
        store_session.ticketQuantity = quantity;
        store_session.ticketPrices = total_prices;
        console.log("Pay button clicked");
    }else{
        ticketQuantity = store_session.ticketQuantity;
        ticketPricesString = JSON.stringify(store_session.ticketPrices);
        totalString = JSON.stringify(
            store_session.ticketQuantity * store_session.ticketPrices
        );
        transactionId = store_session.transaction_id;
    }
   
    console.log("Ticket Quantity " + ticketQuantity + " price " + ticketPricesString + " total " + totalString);

    const create_payment_json = {
        intent: "sale",
        payer: {
        payment_method: "paypal",
        },
        redirect_urls: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        },
        transactions: [
        {
            item_list: {
            items: [
                {
                name: "Cinema Ticket",
                sku: "ticket001",
                price: ticketPricesString,
                currency: "USD",
                quantity: ticketQuantity,
                },
            ],
            },
            amount: {
            currency: "USD",
            total: totalString,
            },
            description: "Payment for cinema ticket",
        },
        ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
    paypal.payment.create(create_payment_json, async (error, payment) => {
        if (error) {
            console.error(error.response);
        } else {
            console.log(payment.transactions);
        for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
                res.redirect(payment.links[i].href);
            }
        }
        }
    });
});
});

router.get("/success", (req, res) => {
    if (!store_session) {
        res.redirect("/");
    } else {
        console.log("This is /succes");
        console.log(store_session);
            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const totalString = JSON.stringify(
            store_session.ticketQuantity * store_session.ticketPrices
            );
                console.log("total" + totalString);
            const execute_payment_json = {
            payer_id: payerId,
            transactions: [
                {
                amount: {
                    currency: "USD",
                    total: totalString,
                },
                },
            ],
            };

        paypal.payment.execute(
            paymentId,
            execute_payment_json,
            async (error, payment) => {
                if (error) {
                    console.error(error.response);
                } else {
                    console.log("This is /succes");
                    const transaction_id = store_session.transaction_id;
                    const transaction_status = "DONE";

                    try {
                        //Update transaction status
                        const query =
                        "UPDATE transactions SET transaction_status = $1 WHERE transaction_id = $2;";
                        const values = [transaction_status, transaction_id];

                        await db.query(query, values, async (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //Get transaction data
                            const queryTicket =
                            "SELECT Tickets.*, Studios.*, Schedule.date, Schedule.hours, Schedule.prices FROM Tickets JOIN Transactions ON Tickets.transaction_id = Transactions.transaction_id JOIN Schedule ON Tickets.schedule_id = Schedule.schedule_id JOIN Studios ON Studios.studio_id = Schedule.studio_id WHERE Tickets.transaction_id = $1;";
                            const valuesTicket = [transaction_id];

                            await db.query(queryTicket, valuesTicket, (err, results) => {
                                if (err) {
                                    console.log("Retrive data failed : " + err);
                                    return res.status(500).redirect("/");
                                } else {
                                    store_session.ticketQuantity = null;
                                    store_session.ticketPrices = null;
                                    store_session.transaction_id = null;
                                    console.log(results.rows);
                                    return res.status(200).render("success.ejs", {
                                        payment,
                                        tickets: results.rows,
                                    });
                                }
                            });
                        }
                        });
                    } catch (err) {
                        console.log("Transaction done failed : " + err);
                        return res.status(500).redirect("/");
                    }
                }
            }
        );
    }
})

router.get("/cancel", async (req, res) => {
    if (!store_session) {
        res.redirect("/");
    } else {
        console.log("This is /cancel" + store_session);
        const transaction_id = store_session.transaction_id;
        const transaction_status = "CANCELED";

        try {
            const query =
                "UPDATE transactions SET transaction_status = $1 WHERE transaction_id = $2;";
            const values = [transaction_status, transaction_id];

            await db.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    store_session.ticketQuantity = null;
                    store_session.ticketPrices = null;
                    store_session.transaction_id = null;
                    console.log("Transaction canceled.");
                    res.render("cancel.ejs");
                }
            });
        } catch (err) {
            console.log("Transaction canceled failed : " + err);
            return res.status(500).redirect("/");
        }
    }
});

//Showing seat layout page
router.get("/seat/:scheduleId", async (req, res) => {
    if (!store_session) {
        res.redirect("/");
    } else {
        console.log("Session /seat" + store_session);
        const { scheduleId } = req.params;
        store_session.schedule_id = scheduleId;

        try {
            //Get sold seats first
            const querySoldSeat =
                "SELECT DISTINCT seat_id FROM ScheduleSeats WHERE schedule_id = $1;";
            const values = [scheduleId];
            const soldSeats = null;

            await db.query(querySoldSeat, values, async (err, soldSeats) => {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Retrive data failed." });
                } else {
                    //Get seats on selected schedule
                    const query =
                        "SELECT Seats.*, Schedule.Schedule_id, Schedule.prices FROM Seats JOIN Schedule ON Schedule.studio_id = Seats.studio_id WHERE Schedule.schedule_id = $1;";

                    await db.query(query, values, (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.json({ message: "Retrive data failed." });
                        } else {
                            //Get schedule information join with studio, theater, and movie
                            const querySchedule =
                                "SELECT Schedule.*, Movies.title, Movies.images, Studios.name AS studio_name, Studios.type, Theaters.name AS theater_name, Theaters.city FROM Schedule JOIN Movies ON Schedule.movie_id = Movies.movie_id JOIN Studios ON Schedule.studio_id = Studios.studio_id JOIN Theaters ON Studios.theater_id = Theaters.theater_id WHERE Schedule.schedule_id = $1;";
                            db.query(querySchedule, values, async(err, schedule) => {
                                if (err) {
                                    console.log(err);
                                    return res.json({ message: "Retrive data failed." });
                                } else {
                                    console.log(store_session);
                                    console.log(soldSeats.rows);
                                    store_session.ticketPrices = results.rows[0].prices;
                                    res.render("seats.ejs", {
                                        seats: results.rows,
                                        scheduleId: scheduleId,
                                        soldSeats: soldSeats.rows,
                                        schedule: schedule.rows[0],
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.error("Page is not availible", error);
            return res.status(500).json({ message: "An error occurred during showing page." });
        }
    }
});

//Selected seat API
router.post("/select-seat", async (req, res) => {
    const { seatsId, scheduleId } = req.body;
    store_session.ticketQuantity = seatsId.length;
    store_session.seats_id = seatsId;
    try {
        const query =
        "INSERT INTO ScheduleSeats (schedule_id, seat_id) VALUES ($1, $2);";
        seatsId.forEach(async (seatId) => {
            const values = [scheduleId, seatId];
            await db.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Retrive data failed." });
                } else {
                    console.log(store_session);
                    console.log("Selected seat received by server.");
                }
            });
        });
    } catch {
        console.error("Error select seat:", error);
        return res.status(500).json({ message: "An error occurred during select seat." });
    }
});

//Delete selected seat API
router.delete("/delete-select-seat", async (req, res) => {
    const scheduleId = store_session.schedule_id;
    const seatsId = store_session.seats_id;
    try {
        const query =
        "DELETE FROM ScheduleSeats WHERE schedule_id = $1 AND seat_id = $2;";
        seatsId.forEach(async (seatId) => {
            const values = [scheduleId, seatId];
            await db.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.json({ message: "Retrive data failed." });
                } else {
                    store_session.seats_id = null;
                    console.log("Selected seat deleted from server.");
                }
            });
        });
    } catch {
        console.error("Error select seat:", error);
        return res.status(500).json({ message: "An error occurred during select seat." });
    }
});

router.post("/logout", async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("remember_me_token");
        store_session = null;
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

//Login page
router.get("/login-account", async (req, res) => {
  try {
        res.render("login.ejs", {passwordWrong: false});
  } catch (error) {
    console.error("Page is not availible", error);
    return res.status(500).json({ message: "An error occurred during showing page." });
  }
});

//Login button API
router.post("/login", async (req, res) => {
    const { username, password, remember } = req.body;

    try {
        //Get password from database
        const query = "SELECT password FROM users WHERE username = $1";
        const values = [username];

        await db.query(query, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.json({ message: "Error find password" });
        } else {
            if(results.rows.length == 0){
                return res.render("login.ejs", {passwordWrong: true});
            }else{
                const hash = results.rows[0].password;
                //Compare password with hash password in database
                bcrypt.compare(password, hash, async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error compare the string");
                } else {
                    //If password is correct
                    if (results) {
                        console.log("Login Successfull!");
                        //Get user data from database and store it in session
                        const queryUsernameId =
                            "SELECT * FROM users WHERE username = $1;";
    
                        await db.query(queryUsernameId,[username],async (err, results) => {
                            if (err) {
                                console.log(err);
                            } else {
                                store_session = req.session;
                                store_session.username = results.rows[0].username;
                                store_session.user_id = results.rows[0].user_id;
                                store_session.role = "user";
                                store_session.schedule = null;
                                store_session.seats_id = null;
    
                                let rememberToken = null;
                                // If the user has selected the "remember me" option, generate a token and store it in the database
                                if (remember) {
                                    // Generate a unique token
                                    rememberToken = generateToken();
    
                                    // Calculate the expiration date (e.g., 30 days from now)
                                    const expiresAt = new Date();
                                    expiresAt.setDate(expiresAt.getDate() + 30);
    
                                    // Store the token in the remember_me_tokens table
                                    await db.query(
                                        "INSERT INTO remember_me_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
                                        [store_session.user_id, rememberToken, expiresAt]
                                    );
    
                                    // Set a cookie with the token
                                    res.cookie("remember_me_token", rememberToken, {
                                        expires: expiresAt,
                                        httpOnly: true,
                                        secure: true,
                                    });
                                }
    
                                // Redirect the user to the home page
                                return res.status(200).redirect("/");
                            }
                            }
                        );
                    } else {
                        console.log("Password wrong");
                        return res.status(200).render("login.ejs", {passwordWrong: true});
                    }
                    console.log('Password wrong');
                    res.render("login.ejs", { passwordWrong: true });
                }
                });
            }
        }
        });

        // true if the username and email  is available (no matching rows found), false otherwise
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});


//Register account page
router.get("/register-account", async (req, res) => {
    try {
        res.render("register.ejs", {
            UsernameAvailability: true,
            PhoneNumberAvailability: true,
            EmailAvailability: true,
            usernameRegexAllowed: true,
            emailRegexAllowed: true,
            passwordRegexAllowed: true,
            phoneNumberRegexAllowed: true,
        });

        console.log("Open /register");
    } catch (error) {
        console.error("Page is not availible", error);
        return res.status(500).json({ message: "An error occurred during showing page." });
    }
});

//Register button API
router.post("/register", async (req, res) => {
    const { username, email, password, first_name, last_name, phone_number } =req.body;

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

    try {
        //Check username availability
        const UsernameAvailability = await checkUsernameAvailability(username);
        const PhoneNumberAvailability = await checkPhoneNumberAvailability(phone_number);
        const EmailAvailability = await checkEmailAvailability(email);

        //Username is not already taken, email is not already taken, phone number is not already taken, username is allowed, email is allowed, password is allowed, phone number is allowed
        if (
        UsernameAvailability == true &&
        EmailAvailability == true &&
        PhoneNumberAvailability == true &&
        usernameRegexAllowed == true &&
        emailRegexAllowed == true &&
        passwordRegexAllowed == true &&
        phoneNumberRegexAllowed == true
        ) {
            //Hash password
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    //Hash failed
                    console.log(err);
                    res.status(500).send("Error hashing the string");
                } else {
                    // Insert new user into the database
                    console.log("Hashing Successfull!");
                    const query = `INSERT INTO users (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6);`;
                    const values = [
                        username,
                        email,
                        hash,
                        first_name,
                        last_name,
                        phone_number,
                    ];
                    
                    console.log(hash);
                    await db.query(query, values, (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.json({ message: "Insert account data failed" });
                        } else {
                            // Set session data for the registered user
                            store_session = req.session;
                            store_session.user_id = req.body.user_id;
                            store_session.role = "user";
                            store_session.schedule = null;
                            store_session.seats_id = null;
                            store_session.username = username;
                            console.log("Register Successfull!");
                            res.status(200).redirect("/");
                        }
                    });
                }
            });
            
        } else {
            console.log("Register Failed!");
            res.status(500);
            res.render("register.ejs", {
                UsernameAvailability: await checkUsernameAvailability(username),
                PhoneNumberAvailability: await checkPhoneNumberAvailability(
                phone_number
                ),
                EmailAvailability: await checkEmailAvailability(email),
                usernameRegexAllowed: usernameRegex.test(username),
                emailRegexAllowed: emailRegex.test(email),
                passwordRegexAllowed: passwordRegex.test(password),
                phoneNumberRegexAllowed: phoneNumberRegex.test(phone_number),
            });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res
        .status(500)
        .json({ message: "An error occurred during registration." });
    }
});

//FUNCTION
//Function to check wether the username is already taken or not
async function checkUsernameAvailability(username) {
  try {
    // Query the table for the specified username
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username];
    const result = await db.query(query, values);

    // Return true if the username is available (no matching rows found), false otherwise
    if (result.rowCount > 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false; // Return false in case of an error
  }
}

//Function to check wether the email is already taken or not
async function checkEmailAvailability(email) {
  try {
    // Query the table for the specified email
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await db.query(query, values);

    // Return true if the email is available (no matching rows found), false otherwise
    if (result.rowCount > 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking email availability:", error);
    return false; // Return false in case of an error
  }
}
//Function to check wether the phone number is already taken or not
async function checkPhoneNumberAvailability(phone_number) {
  try {
    // Query the table for the specified username
    const query = "SELECT * FROM users WHERE phone_number = $1";
    const values = [phone_number];
    const result = await db.query(query, values);

    // Return true if the phone number is available (no matching rows found), false otherwise
    if (result.rowCount > 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking phone number availability:", error);
    return false; // Return false in case of an error
  }
}

//Function to check wether the email is already taken or not
async function checkEmailAdminAvailability(email) {
  try {
    // Query the table for the specified email
    const query = "SELECT * FROM Admins WHERE email = $1";
    const values = [email];
    const result = await db.query(query, values);

    // Return true if the email is available (no matching rows found), false otherwise
    return result.rowCount === 0;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false; // Return false in case of an error
  }
}

//Function to check wether the username is already taken or not
async function checkUsernameAdminAvailability(username) {
  try {
    const query = "SELECT * FROM Admins WHERE username = $1";
    const values = [username];
    const result = await db.query(query, values);

    // Return true if the username is available (no matching rows found), false otherwise
    return result.rowCount === 0;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false; // Return false in case of an error
  }
}

// Utility function to generate a random token
function generateToken() {
  const tokenLength = 32;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";

  for (let i = 0; i < tokenLength; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  return token;
}

//Register Admin
router.get("/admin/register", async (req, res) => {
  try {
    res.render("registerAdmin.ejs", {
      UsernameAvailability: true,
      EmailAvailability: true,
      usernameRegexAllowed: true,
      emailRegexAllowed: true,
      passwordRegexAllowed: true,
    });
    console.log("Open /registerAdmin");
  } catch (error) {
    console.error("Page is not available", error);
    return res
      .status(500)
      .json({ message: "An error occurred while showing the page." });
  }
});

router.post("/register-admin", async (req, res) => {
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
            await db.query(query, values, (err, results ) => {
                if (err) {
                    console.log(err);
                    return res.json({ message: 'Insert account data failed' });
                }else{
                    console.log("Register Successfull!");

                    store_session = req.session;
                    store_session.user_id = req.body.user_id;
                    store_session.role = 'admin';
                    store_session.schedule = null;
                    store_session.seats_id = null;
                    store_session.username = username;
                    res.status(200).redirect('/admin/dashboard');
                }
            });
         
          } catch (error) {
            console.log(error);
            return res.json({ message: 'Insert account data failed' });
          }
        });
      } else {
        res.status(200);
        res.render('registerAdmin.ejs', {
          UsernameAvailability: await checkUsernameAdminAvailability(username),
            EmailAvailability: await checkEmailAdminAvailability(email),
            usernameRegexAllowed: usernameRegex.test(username),
          emailRegexAllowed: emailAdminRegex.test(email),
          passwordRegexAllowed: passwordRegex.test(password),
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'An error occurred during registration.' });
    }
  });

//Log in Admin 
router.get('/admin/login', async (req, res) =>{
    try{
        console.log("Open /loginAdmin");
        return res.status(200).render('loginAdmin.ejs',{passwordWrong: false});
    }catch(error){
        console.error('Page is not availible', error);
        return res.status(500).json({ message: 'An error occurred during showing page.' });
    }
});

//Login button API
router.post('/login-admin', async (req, res) => {
    const { username, password} = req.body;

    try{
        const query = 'SELECT password FROM Admins WHERE username = $1';
        const values = [username];

    await db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error find password" });
      } else {
        if(results.rows.length == 0){
            return res.render("loginAdmin.ejs", {passwordWrong: true});
        }else{
            const hash = results.rows[0].password;

            bcrypt.compare(password, hash, async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error compare the string');
                } else {
                    if(results){
                        console.log("Login Successfull!");
                        const queryUsernameId = 'SELECT admin_id FROM Admins WHERE username = $1;';
                        await db.query(queryUsernameId, [username], async(err, results) => {
                            if(err){
                            console.log(err);
                            }else{
                                console.log(results.rows[0].user_id);
                                store_session = req.session;
                                store_session.user_id = results.rows[0].admin_id;
                                store_session.username = username;
                                store_session.schedule = null;
                                store_session.seats_id = null;
                                store_session.role = 'admin';
                                res.redirect(`/admin/dashboard`, {username : username});
                            }
                        });
                    }else{
                        console.log("Password wrong")
                        return res.status(200).render('loginAdmin.ejs', {passwordWrong: true});
                    }
                }
            });
        }
            }
        });

    // true if the username and email  is available (no matching rows found), false otherwise
    console.log("Open /loginAdmin");
  } catch (error) {
    console.error("Page is not availible", error);
    return res
      .status(500)
      .json({ message: "An error occurred during showing page." });
  }
});

//Payment recap
//function to get all purchases
async function getAllPurchases() {
  try {
    const query = "SELECT * FROM transactions_details_seats ORDER BY transaction_id DESC;";
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving purchase information:", error);
    return [];
  }
}

router.get("/transactionDetails", async (req, res) => {
  try {
    const purchases = await getAllPurchases();

    if (purchases.length === 0) {
      console.log("No purchase information available.");
    } else {
      console.log("Purchase Information:");
      purchases.forEach((purchase) => {
        console.log("Transaction ID:", purchase.transaction_id);
        console.log("User ID:", purchase.user_id);
        console.log("Transaction Date:", purchase.transaction_date);
        console.log("Transaction Status:", purchase.transaction_status);
        console.log("------------------------");
      });
    }

    res.render("profile.ejs", { purchases }); // Render the "transactionDetails.ejs" template and pass the purchases data
  } catch (error) {
    console.error("Error fetching purchase information:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching purchase information.",
      });
  }
});

//profile
// Query the database to retrieve user information
router.get("/profile", async (req, res) => {
  try {
    // Check if the user is logged in
    if (!store_session) {
      // If not logged in, redirect to the login page or display an error message
      return res.redirect("/login-account");
      // Alternatively, you can render an error page:
      // return res.render('error', { message: 'You need to log in to view your profile.' });
    }

    const query = "SELECT * FROM users WHERE username = $1";
    const values = [store_session.username];
    const purchases = await getAllPurchases();
    if (purchases.length === 0) {
      console.log("No purchase information available.");
    } else {
      // console.log('Purchase Information:');
      // purchases.forEach((purchase) => {
      //   console.log('Transaction ID:', purchase.transaction_id);
      //   console.log('User ID:', purchase.user_id);
      //   console.log('Transaction Date:', purchase.transaction_date);
      //   console.log('Transaction Status:', purchase.transaction_status);
      //   console.log('------------------------');
      // });
    }
    await db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error retrieving user information." });
      } else {
        const user = results.rows[0];
        res.render("profile.ejs", { user, purchases });
      }
    });
  } catch (error) {
    console.error("Error occurred while retrieving user profile:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving user profile." });
  }
});

//Timer
const timeLimit = 1 * 10;

let countdownTimer;

function updateTimerDisplay(remainingTime) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  console.log(
    `Time remaining: ${minutes}:${seconds.toString().padStart(2, "0")}`
  );
}

function startTimer() {
  let remainingTime = timeLimit;

  // Update the timer display initially
  updateTimerDisplay(remainingTime);

  // Start the countdown timer
  countdownTimer = setInterval(() => {
    remainingTime--;

    // Update the timer display on each tick
    updateTimerDisplay(remainingTime);

    // Check if the time limit has been reached
    if (remainingTime === 0) {
      clearInterval(countdownTimer);
      console.log("Time limit reached. Selection expired.");
      // Handle the expiration logic here
      return false;
    }
  }, 1000); // Update the timer every 1 second
}

      
      
   
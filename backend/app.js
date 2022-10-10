const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
const { ValidationError } = require('sequelize');

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const routes = require('./routes');





// Security Middleware
if (!isProduction) {
    //enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

//Set the -csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)

// app.get(
//     '/',
//     async (req, res) => {
//         // const csrfToken = req.csrfToken();
//         // res.cookie("XSRF-TOKEN", csrfToken);
//         return res.send('Welcome!');
//     });

app.use(routes);

// 4zEpdDs6-gmgEAwm-Phqc536zA_jzjzozfcw




// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    //check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);

    const errStack = {};
    if (!isProduction) {
        errStack.stack = err.stack;
    }


    if (typeof err.errors !== 'undefined') {
        let errors = {};
        for (let i = 0; i < err.errors.length; i++) {
            let el = err.errors[i];
            if (el === "Authentication required") {
                res.statusCode = 401;
                return res.json({
                    "message": "Authentication required",
                    "statusCode": 401
                  })
            }
            if (el === "Email is required") {
                errors.email = el;
            }
            if (el === "Password is required") {
                errors.password = el;
            }
            if (el === 'Invalid email') {
                errors.email = el;
            }
            if (el === "First Name is required") {
                errors.firstName = el;
            }
            if (el === "Last Name is required") {
                errors.lastName = el;
            }
            if (el === "Name must be 60 characters or less") {
                errors.name = el;
            }
            if (el === "About must be 50 characters or more") {
                errors.about = el;
            }
            if (el === "Type must be Online or In person") {
                errors.type = el;
            }
            if (el ===  "Private must be a boolean") {
                errors.private = el;
            }
            if (el === "City is required") {
                errors.city = el;
            }
            if (el === "State is required") {
                errors.state = el;
            }
            if (el === "Street address is required") {
                errors.address = el;
            }
            if (el === "Latitude is not valid") {
                errors.lat = el;
            }
            if (el === "Longitude is not valid") {
                errors.lng = el;
            }
            if (el === "Venue does not exist") {
                errors.venueId = el;
            }
            if (el === "Name must be at least 5 characters") {
                errors.name = el;
            }
            if (el === "Type must be Online or In person") {
                errors.type = el;
            }
            if (el === "Capacity must be an integer") {
                errors.capacity = el;
            }
            if (el === "Price is invalid") {
                errors.price = el;
            }
            if (el === "Description is required") {
                errors.description = el;
            }
            if (el === "Start date must be in the future") {
                errors.startDate = el;
            }
            if (el === "End date is less than start date" ) {
                errors.endDate = el;
            }
            if (el === "Page must be greater than or equal to 0") {
                errors.page = el;
            }
            if (el === "Size must be greater than or equal to 0") {
                errors.size = el;
            }
            if (el === "Name must be a string") {
                errors.name = el;
            }
            if (el === "Type must be 'Online' or 'In Person'") {
                errors.type = el;
            }
            if (el === "Start date must be a valid datetime") {
                errors.startDate = el;
            }
            if (el === 'The provided credentials were invalid.') {
                errors.invalidCredentials = el;
            }
            if (el ===  'Please provide a valid email.') {
                errors.invalidEmail = el;
            }
            if (el === 'Validation isIn on type failed') {
                errors.validationError = el;
            }
            if (el === 'Invalid value') {
                errors.validation = el;
            }
        };


        res.json({
            // title: err.title || 'Sever Error',
            message: err.message,
            statusCode: res.statusCode,
            errors,
            ...errStack
        });
    } else {
        res.json({
            title: err.title || 'Server Error',
            message: err.message,
            errors: err.errors,
            ...errStack
          });
    }


});






module.exports = app;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
//Intiailzie app with express
const app = express();
const MongoClient = require('mongodb').MongoClient;


//import the routes
app.use(express.json()); //parses incoming requests with Json playloads


//https://purplecaredocs.herokuapp.com/
//Database connection
mongoose.Promise = global.Promise; //fix deprecation issue
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});

//Port to be used for the server
const _PORT= process.env.PORT;
const mongoURI = process.env.DATABASE;

//Create mongo connection
const conn = mongoose.createConnection(mongoURI, {useNewUrlParser: true, useUnifiedTopology:true});
let gfs;

conn.on('connected', () => {
    console.log('Connected to the database');
});

conn.on('error', (err) =>{
    console.log(`Unable to connect to the database: ${err}`);
});

const client = new MongoClient(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
    const collection = client.db("test").collection("devices");
    //perform actions on the collection object
    client.close();
});

//---------------- Middlewares ----------------//
//CORS MW
app.use(cors());

//body parser MW
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true, limit:"50mb"}));


//Passport MW
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


//Index Router
app.get('/',(req,res,next) => {
    res.send('I am alive')
});

const UserRoutes = require('./routes/users');


//Users Routes
app.use('/users', UserRoutes);

//start the server
app.listen(_PORT, () => {
    console.log('Server started');
});
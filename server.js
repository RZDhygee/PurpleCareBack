const express = require('express');
const mongoose = require('mongoose');

//Intiailzie app with express
const app = express();
const MongoClient = require('mongodb').MongoClient;


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

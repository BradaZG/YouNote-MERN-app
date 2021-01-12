require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/note');
const app = express();

const API_PORT = process.env.PORT;

app.use(express.json());

const dbPath = process.env.MONGODB_URI;

mongoose
  .connect(dbPath, {
    dbName: 'you_note',
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('The database has been connected...');
  })
  .catch((error) => console.log(error.message));

app.listen(API_PORT, () => console.log(`Server listening on Port ${API_PORT}`));

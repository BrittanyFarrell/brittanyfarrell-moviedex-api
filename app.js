/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable strict */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); 
const helmet = require('helmet');
const data = require('./data-file.json');
const app = express();
const apiToken = process.env.API_TOKEN;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');

    console.log('validate bearer token middleware');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    
    next();
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});

function handleGetMovie(req, res) { 
    const { genre, country, avg_vote } = req.query;
    let list = data;

    if (genre) {
        let filtered = list.filter(item => {
            return item.genre.toLowerCase().includes(genre.toLowerCase());
        });

        list  = filtered;
    }

    if (country) {
        let filtered = list.filter(item => {
            return item.country.toLowerCase().includes(country.toLowerCase());
        });

        list  = filtered;
    }

    if (avg_vote) {
        let filtered = list.filter(item => {
            return item.avg_vote >= avg_vote;
        });

        list  = filtered;
    }

    res.send(list);

}

app.get('/movie', handleGetMovie);
const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');

// GET /laugh 

router.get('/', function(req, res) {
    console.log(req.query.jokeType);
        //if dadzjokes
    if (req.query.jokeType === "chuck") {
        //if chuck jokes
        var chuckUrl = 'http://api.icndb.com/jokes/random';
        // Use request to call the API
        axios.get(chuckUrl).then( function(apiResponse) {
            console.log(apiResponse.data);
            var joke = apiResponse.data.value;
            // res.render('laugh/laugh');
            res.render('laugh/laugh', { joke });
        })
        .catch(function(err) {console.log(err);})
        .finally(function() {
            console.log('made it to the end of chuck successfully')
        })
    } else {
        var dadzUrl = 'https://icanhazdadjoke.com/';
        // Use request to call the API
        axios.get(dadzUrl, {headers:{
            "Accept": "application/json"
        }}).then( function(apiResponse) {
        var joke = apiResponse.data;
        console.log("---------------")
        console.log(apiResponse.data)
        // res.render('laugh/laugh');
        res.render('laugh/laugh', { joke });
        })
        .catch(function(err) {console.log(err);})
    .finally(function() {
        console.log('made it to the end of dadz successfully')
    })
    }
})
    
   
  

// GET /laugh (think results) server will make API call and render /laugh page with resuls of api call

// GET /laugh/faves show all faves from db
router.get('/faves', function(req,res) {
    res.send("this will be a page that will show your favorite jokes");
});

// POST /laugh/faves add fave joke to db
router.post('/', function(req,res) {
    db.jokes.create({
        content: req.body.jokeContent
    }).then( models.usersJokes.create({
        usersId: req.params.userId,
        jokesId: db.jokes.findOne({
            where: {
                content: req.body.jokeContent
            }
        }).id
    })).then(function() {
        res.redirect('/faves');
    })
    console.log(req.body.joke);
    });

// PUT /laugh  *update* user db to include joke preference with whichever radial button is selected

// GET /laugh/faves/:id show specific fave from db
router.get('/faves/:id', function(req, res) {
    res.send(`this will be a page to show a single joke`);
});

module.exports = router;
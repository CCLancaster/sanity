const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');


// GET /laugh 
router.get('/', function(req, res) {
    console.log(req.query.jokeType);
        
    if (req.query.jokeType === "chuck") {
        //if chuck jokes
        //add joke preference to user db
        db.user.findOne({
            where: {
                id: req.user.id
            }
        }).then(function(user) {
            user.update({
                jokeSource: req.query.jokeType
            })
        })
        .then(function (req, res) {
            console.log("jokeSource has been added:", user.jokeSource)
        })

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
        //if dadzjokes
        //add joke preference to user db
        db.user.findOne({
            where: {
                id: req.user.id
            }
        }).then(function(user) {
            user.update({
                jokeSource: req.query.jokeType
            })
        })
        .then(function (req, res) {
            console.log("jokeSource has been added:", user.jokeSource)
        })

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


// GET /laugh/faves show all faves from db
router.get('/faves', function(req,res) {
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then(function(user) {
        user.getJokes().then(function(jokes){ 
            res.render('laugh/faves', { jokes })

        })
    })
});


// POST /laugh add fave joke to db
router.post('/', function(req,res) {
    db.user.findOne({
        where: {
            id: req.user.id
        }
    }).then( function(user) {
        db.joke.findOrCreate({ 
            where: { content: req.body.jokeContent }
        }).spread(function(joke, created) {
            user.addJoke(joke).then(function(joke) {
                console.log(joke, " added to", user);
                res.redirect('/laugh');
            })
        })
    })
});

// DESTROY - DELETE /laugh/faves/:id
router.delete('/faves', function(req, res) {
console.log('made it to the beginning of delete')
    db.joke.destroy({
        where: { content: req.body.jokeContent }
    }).then(() => {
        res.redirect('/laugh/faves');
    })
});


module.exports = router;
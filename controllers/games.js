const Game = require('../models/game')
const Coach = require('../models/coach')

module.exports = {
    new: newGame,
    create,
    index,
    show
}

function newGame(req, res) {
    res.render("games/new", { title: "Add Game", errorMsg:"" })
}

async function create(req, res) {
    console.log(req.body)
    req.body.currentGame = !!req.body.currentGame
    req.body.huskysStarters = req.body.huskysStarters.split(',')
    req.body.oppenentsStarters = req.body.oppenentsStarters.split(',')
    req.body.finalScore = req.body.finalScore.split(',')
    req.body.huskysQtrlyScore = req.body.huskysQtrlyScore.split(',')
    req.body.oppenentsQtrlyScore = req.body.oppenentsQtrlyScore.split(',')

    if(req.body.huskysWin === 'on') {
        req.body.huskysWin = true
    }   else {
        req.body.huskysWin = false
    }

    for(let key in req.body) {
        if(req.body[key] === "") 
            delete req.body[key]
        }

        try {
            const game = await Game.create(req.body)
            res.redirect(`/games/${game._id}`)
        }   catch (err) {
            console.log(err)
            res.render("games/new", { errorMsg: err.message })
        }
    }

async function index(req, res) {
    const games = await Game.find({})
    console.log(games)
    res.render('games/index', { title: "Add Game", games })
}

async function show(req, res) {
    try {
        const game = await Game.findById(req.params.id).populate('coach')
        console.log(game)
        const coaches = await Coach.find({ _id: { $nin: game.coach } }).sort('name')
        // console.log(coaches)
        res.render('games/show', { title: 'Game Results', game, coaches })
    }   catch(err) {
        console.log(err)
        res.redirect('/games')
    }
}
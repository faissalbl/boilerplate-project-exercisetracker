const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const { getUser, getUsers, saveUser } = require('./services/UserService')
const { getExercises, saveExercise } = require('./services/ExerciseService')

const databaseService = require('./services/DatabaseService')
databaseService.connect()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.route('/api/users')
    .get(async (req, res, next) => {
        try {
            const result = await getUsers()
            res.json(result)
        } catch(err) {
            next(err)
        }
    })
    .post(async (req, res, next) => {
        try {
            const result = await saveUser(req.body.username)
            res.json(result)
        } catch(err) {
            next(err)
        }
    })

app.post('/api/users/:_id/exercises', async (req, res, next) => {
    console.log('request', req.params, req.body)

    const userId = req.params._id
    const { description, duration } = req.body
    const date = req.body.date || new Date()

    try {
        let result = await saveExercise(userId, description, duration, date)

        result = { 
            _id: result.user._id, 
            username: result.user.username, 
            description: result.description, 
            duration: result.duration, 
            date: result.date.toDateString() 
        }

        console.log('response', result)

        res.json(result)
    } catch(err) {
        console.error(err)
        next(err)
    }
})

app.get('/api/users/:_id/logs', async (req, res, next) => {
    console.log('request', req.params, req.query)
    try {
        const userId = req.params._id

        let from = req.query.from
        from = from ? new Date(from) : from

        let to = req.query.to
        to = to ? new Date(to) : to

        let limit = req.query.limit
        limit = limit ? parseInt(limit) : limit

        const user = await getUser(userId)

        let exercises = await getExercises(userId, from, to, limit)
        exercises = [...exercises].map(exercise => {
            const { description, duration, date } = exercise
            return {
                description,
                duration,
                date: date.toDateString()
            }
        })

        const result = {
            _id: user._id,
            username: user.username,
            count: exercises.length,
            log: [ ...exercises ]
        }

        console.log('response', result)

        res.json(result);
    } catch(err) {
        console.error(err)
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status = err.status || 500;
    res.json({ error: err.message || "Something broke!" })
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

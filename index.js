const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const { getUsers, saveUser } = require('./services/UserService')

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

app.use((err, req, res, next) => {
    res.status = err.status || 500;
    res.json({ error: err.message || "Something broke!" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})

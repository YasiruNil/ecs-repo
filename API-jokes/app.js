const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

require('./JokeSchema')

const jokeModel = mongoose.model('joke')

main().catch(err => console.log(err));


async function main() {
//    await mongoose.connect('mongodb://host.docker.internal:7001/yasiru');  
//    await mongoose.connect('mongodb://172.17.0.2:27017/yasiru');  
//    await mongoose.connect('mongodb://mongodb:27017/mukeshdb');  
   await mongoose.connect(`${process.env.MONGOURI}`);  
}

mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo yeahh")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

app.use(express.json())
app.use(cors())

// ========== API V1 Routes ==========
const v1Router = express.Router()

v1Router.get('/getJokes', async (req, res) => {
    try {
        const jokes = await jokeModel.find({})
        res.json({ jokes })
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch jokes' })
    }
})

v1Router.post('/post-joke', async (req, res) => {
    try {
        const newJoke = await jokeModel.create({
            joke: req.body.joke
        })
        res.json({ newJoke: newJoke })
    } catch(err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to create joke' })
    }
})

v1Router.get('/', (req, res) => {
    res.json({ message: "API v1 is up and running" })
})

// Mount v1 routes at /api/v1
app.use('/api/v1', v1Router)

// Health check endpoint (no version)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: 'v1' })
})

app.listen(5000, () => {
    console.log("server running on 5000")
})
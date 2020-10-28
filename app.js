const path = require('path')
const url = require('url');

const express = require('express')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const hbs = require('hbs')

publicDirPath = path.join(__dirname, '/public')
viewsPath = path.join(__dirname, '/templates/views')
const app = express()

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDirPath))
app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = mongodb.MongoClient

MongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true })
    .then((client) => {
        console.log('Connected to Database')

        const db = client.db('users')

        const detailsCollection = db.collection('details')

        app.get('/', (req, res) => {
            detailsCollection.find().toArray()
                .then((result) => {
                    res.render('index', { result })
                }).catch(err => console.log(err))
        })

        app.post('/add', (req, res) => {
            detailsCollection.insertOne(req.body)
                .then(result => console.log('Inserted ' + result.insertedCount + ' record.'))
                .catch(err => console.log(err))

            res.redirect('/')
        })

        app.get('/search', (req, res) => {
            const urlObj = url.parse(req.url, true)
            detailsCollection.find({
                $or:
                    [{ 'name': urlObj.query.key },
                    { 'location': urlObj.query.key }
                    ]
            }).toArray().then((searchResult) => {
                res.json(searchResult)
            }).catch(err => console.log(err))
        })

        app.delete('/remove', (req, res) => {
            const urlObj = url.parse(req.originalUrl, true)
            console.log(urlObj.query.id)
            detailsCollection.deleteOne({ '_id': mongodb.ObjectId(urlObj.query.id )})
                .then(result => {
                    console.log(result)
                }).catch(err => console.log(err))
            
            res.redirect('/')
        })

        app.listen(process.env.PORT, () => {
            console.log('App is up and running at port', process.env.PORT)
        })
    }).catch(error => console.error(error))



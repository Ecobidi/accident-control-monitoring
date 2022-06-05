require('dotenv').config({path: __dirname + '/.env'})
let express = require('express')
let expressSession = require('express-session')
let connectFlash = require('connect-flash')
let mongoose = require('mongoose')

let { APPNAME, PORT, dbhost, dbport, dbname, sessionsecret, domain,} = require('./config') 

let port = process.env.PORT || PORT

// mongoose.connect(`mongodb://${dbhost}:${dbport}/${dbname}`)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qmunc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('connected to database: ' + process.env.DB_NAME)
} catch (error) {
  console.log('Error connecting to database: ' + process.env.DB_NAME)
  console.log(error)
}

// routes
const routes = require('./routes')

// const DBCounterModel = require('./models/db_counter')

// DBCounterModel.insertMany([{key: 'accidents_id'}, {key: 'users_id'}, {key: 'offending_drivers_id'}, {key: 'eye_witness_reports_id'}, ])

// DBCounterModel.create({key: 'enquiries_id'})

// init express App
let app = express()

// view engine 
app.set('view engine', 'ejs')
app.set('views', './views')

// expressStatic
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'))

// bodyparser middlewares
app.use(express.json())
app.use(express.urlencoded())

// express-session middleware
app.use(expressSession({
  secret: sessionsecret,
  saveUninitialized: true,
  resave: true,
}))
// connect-flash
app.use(connectFlash())

app.use((req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.user = req.session.user || { username: 'test' }
  app.locals.appname = APPNAME
  app.locals.port = PORT
  app.locals.domain = domain + ':' + PORT
  next()
})

// routes

app.use('/', routes)


app.listen(port, () => { console.log(`${APPNAME} running on port ${port}`) })
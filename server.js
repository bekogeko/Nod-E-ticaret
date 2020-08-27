const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongooseSetup = require('./models/mongooseSetup')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
//Models
const userModel = require('./models/userModel')
//Routes
const loginRoute = require('./routers/loginRoute')
const adminRoute = require('./routers/adminRoute')
const indexRoute = require('./routers/indexRoute')
const registerRoute = require('./routers/registerRoute')
const apiRoute = require('./routers/apiRoute')
const logoutRoute = require('./routers/logoutRoute.js')
const productRoute = require('./routers/productRoute.js')
const categoryRoute = require('./routers/categoryRoute.js')


mongooseSetup.init()

initializePassport(passport)


app.set('view-engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))

//site icerisinde get motedunun req degiskenine birsey eklemek icin flash yukluyoruz
app.use(flash())
//sunucunun Ram'ine session(cookie) atamak icin kullaniyoruz 
app.use(session({
    //RAM'e ekledikten sonra sifrelemek icin ne kadar uzun o kadar guvenli 
    secret:'Wmwy6eU8RW6cWwPnQx0d7YSGZtq0cVYIfy4nTivLeTZNfWJN35FUT3UDAKTpKW1z',//process.env.SESSION_SECRET,
    
    //ardi ardina ayni kayit istegi gelirse kaydetme
    resave:false,
    //degisiklik yapilmamisi kaydetme 
    saveUninitialized:false,
    //session'in omrunu milisaniye cinsinden belirtiyoruz
    cookie:{maxAge:18000000}//5 hour in miliseconds
}))
//sifre giris sistemini init ediyoruz
app.use(passport.initialize())


app.use(passport.session())



//Routes
app.use('/login', loginRoute)
app.use('/admin',adminRoute)
app.use('/', indexRoute)
app.use('/register', registerRoute)
app.use('/api',apiRoute)
app.use('/logout',logoutRoute)
app.use('/product',productRoute)
app.use('/category',categoryRoute)


app.all('*',(req,res,next) => {
    res.status(404).redirect('/');
});





app.listen(port,(req,res)=>{
    console.log('Listening on port:' + port)
})




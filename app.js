import  express from 'express'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
// 这个包允许我们使用.evn文件中的变量
import dotenv from 'dotenv'
import indexRoutes from './routes/index.js'
import userRoutes from './routes/users.js'
import bodyParser from 'body-parser'

// 使用passport作为每一个路由的中间键来对用户进行验证
// import passport from 'passport'
// 配置dotenv，之后我们就可以使用.env文件中的变量了：process.env.变量名字
dotenv.config()

// 引包，否则passport的配置文件不会执行
// import passportConfig from './config/passport-local-strategy.js'

// 使用passport jwt strategy进行用户验证
import passportConfig from './config/passport-jwt-strategy.js'



mongoose.connect(process.env.MONGODB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},
    ()=> console.log('MongoDB connected!')
    )

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// 实现authentication时，必须要用到cookie和session
// app.use(cookieSession({
//     maxAge: 1000 * 60 * 60 * 24,
//     keys: [process.env.SECRET]
// }))

// 在所有路由下，使用passport中间键
// 注意！这个必须写在session配置下面，因为passport使用了session
// app.use(passport.initialize())
// app.use(passport.session())

app.use('/', indexRoutes)
app.use('/user', passportConfig.authenticate('jwt', {session:false}), userRoutes)


app.listen(3000, ()=>{
    console.log('App is running at port 3000!')
})

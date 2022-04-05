// 对passport local strategy进行配置
import passport from 'passport'
import LocalStrategy from 'passport-local'
import passportJwt from 'passport-jwt'
import User from './user.js'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

import dotnet from 'dotenv'
dotnet.config()

// 和使用google oauth不同的是：使用local strategy只需要传入一个回调函数即可，没有选项
// 这个回调函数会在passport取得用户名和密码之后触发；因此就会获得username和password了
passport.use(new LocalStrategy(async (username, password, done)=>{
    // 如果用户存在，则验证其密码正不正确，如果正确，则将该用户传到下一个中间键
    // 如果用户名不存在，则将false传入下一个中间键
    const user = await User.findOne({username})
    if(user){
        console.log('wrong password')
        if(password===user.password) {
            // 如果密码正确
            console.log('correct!')
            done(null, user)
        }
        else{
            // 如果密码错误
            console.log('wrong password')
            done(null, false)
        }
    }else{
        // 如果用户名不存在
        console.log('no such user')
        done(null, false)
    }
}))

// // 使用jwt
// passport.use(new JwtStrategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_TOKEN_SECRET,
// }, async (jwt_payload, done)=>{
//     console.log('hello')
//     // 如果用户存在，则验证其密码正不正确，如果正确，则将该用户传到下一个中间键
//     // 如果用户名不存在，则将false传入下一个中间键
//     const user = await User.findById(jwt_payload.sub)
//     if(user){
//         // 如果用户名存在；
//         // 注意！使用jwt进行用户验证时，不需要对密码进行验证，因为passport帮我们验证了
//         console.log(user)
//         done(null, user)
//     }else{
//         // 如果用户不存在
//         console.log('not exist!')
//         done(null, false)
//     }
// }))

// 如果用户成功登录，等会将用户信息，如用户在mongodb中的id加密之后，传到浏览器的cookie中储存
// 之后，在每一次浏览器做出请求的时候，都会带着存储这加密后的id的cookie到后端，后端在将这个
// 加密后的id进行解码，之后得到id值，之后拿着id从mongodb查找该用户

// 使用jwt验证的话，就不需要serializeUser()方法和deserializeUser()方法了
// // 用户登录成功后会执行serializeUser()方法，其中的user就是登录成功的user
// passport.serializeUser((user, done)=>{
//     // 将登录的user在mongodb中的id值进行加密，之后传到浏览器的cookie中
//     done(null, user.id)
// })
// // 这个方法会在浏览器做出没一个需要进行用户验证的请求时执行
// // 浏览器会将我们储存在cookie中的userId发到后端，之后后端解码，拿着id去mongodb中进行匹配
// passport.deserializeUser(async (userId, done)=>{
//     const user = await User.findById(userId)
//     if(user) done(null, user) // 最后，passport会帮我们8把user存在req对象中
// })

export default passport


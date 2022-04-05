import passport from 'passport'
import passportJwt from 'passport-jwt'
import User from '../config/user.js'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

import dotnet from 'dotenv'
dotnet.config()

// 使用passport-jwt-strategy时，不需要serializeUser()方法和deserializeUser()方法
// 使用jwt
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN_SECRET,
}, async (jwt_payload, done)=>{
    // 这个方法会在jwt作为中间键的路由的时候触发
    // jwt_payload就是浏览器传过来的token解码后的对象了
    // 如果当初是通过用户这个对象进行加密的，那么这里解码出来就是用户对象；
    // 如果当初是通过别的进行加密的，如用户的id，那么这里解码出来就是用户id了；
    // 如果用户存在，则验证其密码正不正确，如果正确，则将该用户传到下一个中间键
    // 如果用户名不存在，则将false传入下一个中间键
    console.log(jwt_payload)
    const user = await User.findById(jwt_payload._id)
    if(user){
        // 如果用户名存在；
        // 注意！使用jwt进行用户验证时，不需要对密码进行验证，因为passport帮我们验证了
        console.log(user)
        done(null, user)
    }else{
        // 如果用户不存在
        console.log('not exist!')
        done(null, false)
    }
}))

export default passport

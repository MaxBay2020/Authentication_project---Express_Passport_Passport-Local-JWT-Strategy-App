import express from 'express'

import passport from 'passport'
import User from "../config/user.js";
import isAuth from "./authMiddleware.js"

import dotenv from "dotenv"
dotenv.config()

// 使用jsonwebtoken包来创建token
import jwt from 'jsonwebtoken'

const router = express.Router()


/**
 * -------------- POST ROUTES ----------------
 */

router.get('/test', isAuth, (req,res) => {
  res.send('success!!!')
})
/**
 * 用户登录
 */
router.post('/login', async (req,res) => {
    // 先查找用户是否存在
    const user = await User.findOne(req.body)
    if(!user) // 如果用户不存在
        res.send('no such user!')
    else {
        // 如果用户存在，则发放token；
        // 第一个参数：我们将根据user信息来创建token，这样一来，每个用户对应一个token；
        // 当然，我们也可以根据其他对象来创建token，只要我们一个token能对应一个用户即可
        // 第二个参数：需要和passport.js配置文件中的jwtStrategy中的secretOrKey保持一致
        // 第三个参数：{expiresIn: 1000*60*60*24} 设置token有效期为1天
        // 注意第一个参数！要使用toJSON()方法将用户转换为对象
        const token = jwt.sign(user.toJSON(), process.env.JWT_TOKEN_SECRET, {expiresIn: 1000*60*60*24})
        res.send({
            success: true,
            user,
            token: 'Bearer ' + token // 必须使用这种格式，passport才能识别
        })
    }
})

/**
 * 只用登录的用户才能访问这个路由，通过jwt来判断用户是否持有有效的token
 */
router.get('/protected', passport.authenticate('jwt', {session:false}) , (req,res)=>{
    res.send('success!')
})


// TODO
router.post('/register', async (req, res, next) => {
    const newUser = new User(req.body)
    await newUser.save()
    res.redirect('/login')
});


/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {

  const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

  const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);

});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', (req, res, next) => {

  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
  } else {
    res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
  }
});

// log out用户：同Google OAuth，只要使用req.logout()即可log out用户了
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
  res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});



export default router

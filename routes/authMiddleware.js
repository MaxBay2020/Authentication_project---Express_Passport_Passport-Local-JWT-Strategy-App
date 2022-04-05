
// 创建验证用户是否登录的中间键
const isAuth = (req,res,next)=>{
    // // 方法一：使用req.user来判断用户是否登录
    // if(req.user)    next()
    // else{
    //     res.redirect('/login')
    // }

    // 方法二：使用req.isAuthenticated()来判断用户是否登录
    if(req.isAuthenticated())  next()
    else{
        res.redirect('/login')
    }
}

export default isAuth

const { User } = require("../../../models/User")

let auth = (req, res, next) => {

    // 인증 처리 할것임 -> 디코딩 포함

    // 클라이언트 쿠키에서 토큰을 가져온다 - cookie parser이용

    let token = req.cookies.x_auth // cookie에서 토큰 가져온다 -> 첨 지정 시 이름이 x_auth였다


    // token을 decoded한다음에 유저를 찾는다

    User.findByToken(token, (err, user) => {
        if(err) throw err
        if(!user){
            return res.json({
                isAuth: false,
                error: true
            })
        } 

        req.token = token;
        req.user = user;

        next() // middleware auth에서 계속 다음으로 갈 수 있도록, 없으면 여기에 계속 갇혀있게됨
    })



    //유저가 있으면 인증  okay
    //유저가 없으면 인증 no


}

module.exports = {auth}
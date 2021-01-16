const express = require('express')
const app = express()
const port = 5000;

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { auth } = require('./server/config/middleware/auth')
const { User } = require('./models/User') // model


// application/x-www-form-urlencoded 이런 형태를 분석해서 가져오도록 하는 것
app.use(bodyParser.urlencoded({extended:true}))

// application/json json 형태를 분석해서 가져오도록 하는 것
app.use(bodyParser.json())
app.use(cookieParser())

const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true,
    useFindAndModify: false
    // 써줘야 에러 안뜸
})
.then(() => console.log("mongodb connected.."))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello world!ㅁㄴㅇㄹㅁㄴ')) // simple router

// 라우트 만들기
app.post('/api/users/register', (req, res) => {

    // 회원가입할때 필요한 정보들을 클라이언트에서 가져오면 (여기서 모델 필요)

    const user = new User(req.body) // req.body에 json 형태로 들어있다 (from body Parser)

    user.save((err, doc) => { // mongodb method : 정보들이 user 모델에 저장이 되고 
        if(err) return res.json({success: false, err}) // err : json 형태로 클라이언트에 보내준다

        return res.status(200).json({success: true}) // status(200) : 성공했다고 클라이언트에 보내준다
    })
    // 그것들을 db에 넣어준다

})

app.post('/api/users/login', (req, res) => {
    // db 안에서 요청된 이메일을 찾는다

    User.findOne({email: req.body.email}, (err, userInfo) => {
        if(!userInfo){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다"
            })
        }

        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다"})
            }

            userInfo.generateToken((err, user) => {
                if(err) return res.status(400).send(err)
                
                // token saving : cookie!!, local storage ...
                res.cookie('x_auth', user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
            })
        })

    })

    // 이메일이 있다면 비밀번호가 맞는지 확인

    // 유저를 위한 토큰 생성
})


app.get('/api/users/auth', auth ,(req, res) => {
    // middleware에서 넣어준 req.token, user에 의해 여기서 저걸 가져와서 쓸 수 있다
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 auth가 true라는 말 

    res.status(200).json({
        _id: req.user._id, // auth에서 userInfo를 넣어줬기 때문에 id를 클라이언트에 전달해줄 수  있음
        isAdmin: req.user.role === 0 ? false : true,
        // 지금은 role 0 : 일반유저, 0이 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})

app.get('/api/users/logout', auth,(req, res) => { // 로그인 된 상태이기 때문에 auth 미들웨어를 넣어줌
    User.findOneAndUpdate({_id: req.user._id}, { token: "" }, (err, user) => { // 미들웨어에서  req.user._id 찾은다음에 토큰을 지워준다
        if(err) return res.json({
            success: false, err
        })

        res.status(200).send({
            success: true
        })

    })
})




app.listen(port, () => {console.log(`example app listening on port ${port}!`)})


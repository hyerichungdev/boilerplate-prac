const express = require('express')
const app = express()
const port = 5000;

const bodyParser = require('body-parser')
const { User } = require('./models/User') // model

// application/x-www-form-urlencoded 이런 형태를 분석해서 가져오도록 하는 것
app.use(bodyParser.urlencoded({extended:true}))

// application/json json 형태를 분석해서 가져오도록 하는 것
app.use(bodyParser.json())

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
app.post('/register', (req, res) => {

    // 회원가입할때 필요한 정보들을 클라이언트에서 가져오면 (여기서 모델 필요)

    const user = new User(req.body) // req.body에 json 형태로 들어있다 (from body Parser)

    user.save((err, doc) => { // mongodb method : 정보들이 user 모델에 저장이 되고 
        if(err) return res.json({success: false, err}) // err : json 형태로 클라이언트에 보내준다

        return res.status(200).json({success: true}) // status(200) : 성공했다고 클라이언트에 보내준다
    })





    // 그것들을 db에 넣어준다


})


app.listen(port, () => {console.log(`example app listening on port ${port}!`)})


const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // space 없애줌
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp : { // token 사용가능 기간
        type: Number
    }
})

const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){

            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){

                if(err) return next(err)
                user.password = hash;
                next()
            })
        })

    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    let user = this;

    // plainPassword(req.body) 1234567 === bcrypted password ?
    // plainPassword 암호화 === bcrypted password?

    bcrypt.compare(plainPassword, user.password, function(err, isMatch){
        if(err) return cb(err)

        cb(null, isMatch) // 에러는 없고, 비밀번호는 같다(isMatch === true)
    })
}


userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken 이용해서 token을 생성
    let user = this;

    let token = jwt.sign(user._id.toHexString(), 'secretToken') // db에 아이디 = user.id
    user.token = token
    user.save(function(err, userInfo){
        if(err) return cb(err)
        cb(null, userInfo)
    })
    // user.id + 'secretToken' = token;

    // 'sercretToekn' -> user.id가 나옴 // token을 가지고 user.id가 뭔지 알 수 있다
}

userSchema.statics.findByToken = function(token, cb){
    let user = this;

    // token 디코딩
    jwt.verify(token, 'secretToken', function(err, decoded){ // decoded : user._id
        // 유저 아이디 이용해서 유저 찾은 다음에
        user.findOne({"_id": decoded, "token": token}, function (err, userInfo){
            if(err) return cb(err)

            cb(null, userInfo)

        })
        
        // 클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인


    


    })
}




const User = mongoose.model('User', userSchema)

module.exports = {User}
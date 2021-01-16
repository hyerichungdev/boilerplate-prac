
if(process.env.NODE_ENV === "production"){ // 환경변수가 프로덕션 모드이면
    module.exports= require('./prod') // prod.js에서 가져가고
} else { // development 라면
    module.exports= require('./dev') // dev.js에서 가져간다
}
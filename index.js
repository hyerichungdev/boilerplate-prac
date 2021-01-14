const express = require('express')
const app = express()
const port = 5000;

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ri:abcd1234@boilerplate.rw7i0.mongodb.net/boilerplate?retryWrites=true&w=majority', {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true,
    useFindAndModify: false
    // 써줘야 에러 안뜸
})
.then(() => console.log("mongodb connected.."))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('hello world!'))
app.listen(port, () => {console.log(`example app listening on port ${port}!`)})


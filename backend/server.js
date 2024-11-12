const express = require('express');
const app = express();
const port = 8080;
let connection = require('./db')
const cors = require('cors')
connection();

app.set('view engine', 'ejs')
//all routes imports
let userRouter = require('./routes/userRoutes');
let postRouter = require('./routes/postRoutes');
app.use(express.static('public'))
app.use(cors())
app.use(express.json({limit:"50mb"}))


app.get('/', (req, res) => {
    res.send('welcome page')
})


app.use('/users', userRouter)
app.use('/posts', postRouter)


app.listen(port, () => {
    console.log('server is running on port ' + port)
})
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
require('dotenv').config();
mongoose.connect(process.env.MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.get('/', (req,res)=>{
console.log("Emaan")
})


const user = require('./models/User')
const blog = require('./models/BlogPost')
let AuthenticationRoutes = require('./Routes/authenticationRoutes')
let blogRouter=require('./Routes/blogRoutes')

app.use('/auth', AuthenticationRoutes);
app.use('/blogs', blogRouter);

app.listen(8080, () => {
  console.log(`Server is running on port ${port}`);
});

import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import AuthRoutes from './Routes/Auth.routes';
import VideoRoute from './Routes/Video.routes'
import cors from 'cors'
config();

const server = express();
//===========Middlewares=============
server.use(cors())

//===========MONGODB CONNECTION=======
const mongoURI = process.env.mongoURI;
connect(mongoURI, (error)=>{
    if (error){
        return console.log(error);
    }
    console.log('Connection to MongoDB was Successful')
})


//===========Server Endpoint========
server.use(AuthRoutes)
server.use(VideoRoutes)

const PORT = process.env.PORT ?? 5000;

server.listen(PORT, ()=>{
    console.log(' Server started on PORT ')
})



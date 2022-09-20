import { verify } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const Auhenticate = (request, response, next) => {
    const token = request.headers['x-auth-token'];

    verify(token, process.env.cookie_secret, (error, decoded)=>{
        if (error){
            return response.status(400).json({msg:'Signup or Login to upload video'})
        }
        request.token = decoded;
        next()
    })
}
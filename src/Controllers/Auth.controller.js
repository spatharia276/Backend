import { IncomingForm } from 'formidable';
import { genSalt, hash, compare } from 'bcrypt';
import { config } from 'dotenv';
import { verify, sign } from 'jsonwebtoken';
import { userModel } from '../Models/User.model'
config()

class AuthController{


// Signup method
signup(request, response){
    const form = new IncomingForm();

    form.parse(request, async (error, fields, files)=>{
        if (error){
            return response.status(500).json({msg:'Network Error: Failed to create account, please try again later'})
        }

        const{ username, email, password } = fields;
        const salt = genSalt(15);
        const hashedPassword = hash(password, salt);
        const newAccount = new userModel({
            username,
            email,
            password:hashedPassword
        })
        try{
            const savedAccount = newAccount.save();
            return response.status(201).json({msg:'Account created successfully'})
        }catch(error){
            // TODO handle error correctly
            console.log(error)
            return response.status(500).json({msg:'Failed to create account'})

        }
       
    })
}

// Signin method
signin(request, response){
    const form = new IncomingForm();

    form.parse(request, async(error,fields,files)=>{
        if(error){
            return response.status(500).json({msg:'Network Error: Failed to login'})
        }
        const{ account, password } = fields;

        const isAccountEmail = account.includes('@');

        if (isAccountEmail){
            const user = userModel.findOne({email:account});

            if(!user){
                return response.status(404).json({msg:'Account with this email does not exist'})
            }

            const isPasswordvalid = compare(password, user.password);
            if (!isPasswordvalid){
                return response.status(400).json({msg:'Invalid credentials'})
            }
            const token_payload = {
                _id:user._id,
                email: user.email,
                username: user.username
            }
            const token = sign(token_payload,process.env.cookie_secret,{ expiresIn:'365d' })

            return response.status(200).json({token})

        }

        const user = userModel.findOne({username:account});

        if(!user){
            return response.status(404).json({msg:'Account with this username does not exist'})
        }

        const isPasswordValid = compare(password, user.password);
        if (!isPasswordValid){
            return response.status(400).json({msg:'Invalid credentials'})
        }
        const token_payload = {
            _id:user._id,
            email: user.email,
            username: user.username
        }
        const token = sign(token_payload,process.env.cookie_secret,{ expiresIn:'365d' })

        return response.status(200).json({token})

         

    })
}

// Forgot password method
forgotPassword(request, response){
    const form = new IncomingForm();

    form.parse(request, async (error, fields, files)=>{
        if(error){
            return response.status(500).json({msg:'Network Error: failed to reset password'})
        }
        const{ email, password } = fields;

        if(!email || !password){
            return response.status(400).json({msg:'All fields are required to reset password'})
        }

        const salt = genSalt(15);
        const hashedPassword = hash(password, salt)

        try{
            const updatedAccount = await userModel.findOneAndUpdate({email:email}, {$set:{ password:hashedPassword } })
            return response.status(200).json({msg:'Account password reset success'})
        } catch (error) {
            return response.status(500).json({msg:'Failed to reset password'})

        }


    })
}



}
import { Router } from 'express';
import { Auhenticate } from '../Middlewares/Authenticate.middleware';

const router = Router();

routes.post('/api/video',Auhenticate, (request, responses)=>{
    return response.status(200).json({msg:'Authenticated'})
})

export default router;
import type {Request, Response} from 'express'
import { Token } from './model.js';

const verifyCr = async(req : Request, res : Response) =>{
    
    const {credentialId} = req.body;

    const findToken = await Token.findOne({
        credentialId
    });

    const result = {
        created : findToken?.createdAt,
        credential : findToken?.credential,
        credentialId,
        name : findToken?.name,
        workerId : findToken?.workerId
    }

    if(!findToken){
        return res
        .status(404)
        .json({success : false, message : "No such registered credential found"})
    }

    return res
    .status(200)
    .json({success : true, result, message : "Credential fetched successfully!"})

}

export {verifyCr}

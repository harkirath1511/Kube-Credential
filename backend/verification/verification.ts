import type {Request, Response} from 'express'
import { Token } from './model.js';

const verifyCr = async(req : Request, res : Response) =>{
    
    const {credential} = req.body;

    const findToken = await Token.findOne({
        credential
    });

    if(!findToken){
        return res
        .status(404)
        .json({success : false, message : "No such registered credential found"})
    }

    return res
    .status(200)
    .json({success : true, findToken, message : "Credential fetched successfully!"})

}

export {verifyCr}

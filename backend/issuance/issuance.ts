import { Token } from "./model.js";
import type {Request, Response} from 'express'
import crypto from 'crypto'

const genToken = async(req : Request, res : Response)=>{

    const {name, credential} = req.body;

    const existingCr = await Token.findOne({
        credential : credential
    });

    if(existingCr){
        return res
        .status(409)
        .json({success : false, message : "The credential has already been issued"})
    };
    const credentialId = crypto.randomBytes(16).toString("hex");

    const newCr = await Token.create({
        name,
        credential,
        credentialId,
    });

    const response = {
        name, 
        credential, 
        credentialId : newCr.credentialId,
        createdAt : newCr.createdAt,
        workerId : newCr.workerId
    }

    if(!newCr){
        return res
        .status(500)
        .json({success : false, message : "Some issue while registering credential!!!"})
    }

    return res
    .status(200)
    .json({success : true, response, message : "Credential issued successfully!!"})
}

export {genToken}

import { Token } from "./model.js";
import type {Request, Response} from 'express'
import crypto from 'crypto'

const genToken = async(req : Request, res : Response)=>{

    const {name, credential} = req.body;
    console.log('test!!!')
    
    const existingCr = await Token.findOne({
        credential : credential
    });

    if(existingCr){
        return res
        .status(409)
        .json("The credential has already been issued")
    };

    console.log("Test!!!!");
    const credentialId = crypto.randomBytes(16).toString("hex");

    const newCr = await Token.create({
        name,
        credential,
        credentialId,
    });

    if(!newCr){
        return res
        .status(500)
        .json("Some issue while registering credential!!!")
    }

    return res
    .status(200)
    .json("Credential issued successfully!!")
}

export {genToken}

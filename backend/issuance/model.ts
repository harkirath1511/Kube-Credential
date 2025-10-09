import mongoose from "mongoose";

const tokenModel = new mongoose.Schema({
    credentialId : {
        type : String,
        unique : true,
        required : true
    },
    credential : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    workerId : {
        type : Number,
        required : true,
        unique : true,
        default : 1
    },
}, {timestamps : true});

export const Token = mongoose.model("Token", tokenModel);

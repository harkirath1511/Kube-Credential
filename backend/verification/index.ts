import express from 'express'
import type {Request , Response} from 'express'
import dotenv from 'dotenv'
import {connectDB} from './db.js'
import { verifyCr } from './verification.js'

dotenv.config({path : './.env'});


const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended : true, limit : "20kb"}));

app.post('/', (req : Request, res : Response)=> verifyCr);

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
    try {
        connectDB();
    } catch (error) {
        console.log("Error connecting to db : ",error );
    }
});



import express from 'express'
import type {Request , Response} from 'express'
import dotenv from 'dotenv'
import {connectDB} from './db/db.js'
import { genToken } from './controllers/issuance.js'
import cors from 'cors'

dotenv.config({path : './.env'});

export const app = express();

const PORT = process.env.PORT;

app.use(cors({
    origin : 'http://localhost:8080'
}))
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended : true, limit : "20kb"}));

app.post('/gen',genToken);

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
    try {
        connectDB();
    } catch (error) {
        console.log("Error connecting to db : ",error );
    }
});


import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './db/connect.js'; 
import fs from 'fs';

dotenv.config();

const app = express();

const port = 8000;


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auth(config));

app.get('/random', (req, res) => {
    res.json({random : Math.random()});
});

//routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
    //import dynamic routes
    import(`./routes/${file}`).then((route) => {
        app.use(route.default);
    }).catch((err) => {
        console.error(`Error loading route ${file}:`, err);
    });
});

const server = async () => {
    try {
        await connect();
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening to the ${port}`);
        })
    } catch (error) {
        console.log("Server error",error.message);
        process.exit(1);
    }
};

server();
    


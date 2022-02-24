import {MongoClient} from 'mongodb';
const username = import.meta.env.VITE_MONGO_USERNAME;
const passwd = import.meta.env.VITE_MONGO_PASSWD;
const mongourl = import.meta.env.VITE_MONGO_URL;
const uri = "mongodb+srv://"+username+":"+passwd+"@"+mongourl+"/myFirstDatabase?retryWrites=true&w=majority";

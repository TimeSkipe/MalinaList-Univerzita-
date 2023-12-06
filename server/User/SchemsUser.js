import mongoose from "mongoose";


//Schema Usera do DB
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    thema:String,
    lan:String,
  });
  
  
const User = mongoose.model('User', userSchema);
export default User;
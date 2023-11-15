import mongoose from "mongoose";

// Schema Seznamu
const listSchema = new mongoose.Schema({
    listname: String,
    selectedOption: String,
    creator:String,
    archive:Boolean,
    members:[
        {
            namemember:String,
            email:String,
        }
    ],
    items:[{
        titleitem:String,
        descitem:String,
        resolved:Boolean,
    }]
});
  
  
const List = mongoose.model('List', listSchema);
export default List;
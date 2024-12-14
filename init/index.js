const mongoose= require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WANDERLUST")
}
main().then(()=>console.log("successfull"))
.catch((err)=>console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"67516f9308e908f7498c704c"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();
const mongoose = require('mongoose');

const gettoTuchSchema  = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    userNumber:{
        type:Number,
        required:true
    },
    select:{
        type:String
    }

})
const gettoTuch = mongoose.model('gettoTuch',gettoTuchSchema);

module.exports = {
    gettoTuch
}

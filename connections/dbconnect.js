const mongoose = require('mongoose')

const HandileDBconnection = async (url) =>{
    try{
        await  mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
        console.log('db is connected')

    }catch(error){
        console.log(error,'error while connecting to db')
    }
}
module.exports = {
    HandileDBconnection
};
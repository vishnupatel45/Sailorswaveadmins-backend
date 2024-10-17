const {gettoTuch} = require('../models/gettoTuch');

const 
HandileAdduser = async (req,res) =>{
    try{
        const {userName, userEmail, userNumber,select} = req.body;
        const user = await gettoTuch.create({userName, userEmail, userNumber,select})
        res.status(201).send(user)
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    HandileAdduser
}
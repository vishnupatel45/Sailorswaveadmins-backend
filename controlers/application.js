const { FormData } = require('../models/applicationForm');

const Postapplicationform = async (req, res) => {
    try {
        const applicationId = Math.floor(1000000000 + Math.random() * 9000000000);
        const candidate = new FormData({
            applicationId:applicationId,
            applicationstatus:false,
            applyFor: req.body.applyFor,
            candidateName: req.body.candidateName,
            fatherName: req.body.fatherName,
            dob: req.body.dob,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            houseNo: req.body.houseNo,
            postOffice: req.body.postOffice,
            policeStation: req.body.policeStation,
            district: req.body.district,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            tenthschool: req.body.tenthschool,
            tenthyear: req.body.tenthyear,
            tenthpercentage: req.body.tenthpercentage,
            twelfthschool: req.body.twelfthschool,
            twelfthyear: req.body.twelfthyear,
            twelfthpercentage: req.body.twelfthpercentage,
            degreeschool: req.body.degreeschool,
            degreeyear: req.body.degreeyear,
            degreepercentage: req.body.degreepercentage,
        });

        const formData = req.body;
        console.log(formData, 'hello one body');
        await candidate.save();

        res.status(201).json({ message: 'Application submitted successfully!', candidateId: candidate._id });
    } catch (error) {
        console.error(error, 'Error while handling post application form');
        res.status(500).send({ error: 'Failed to create candidate', details: error.message });
    }
};

const Getapplicationform = async(req,res) =>{
    try{
        const candidate = await FormData.find();
        res.status(200).json(candidate);
    }catch(error){
        console.error(error, 'Error while handling get application form');
    }
}

module.exports = {
    Postapplicationform,
    Getapplicationform
};

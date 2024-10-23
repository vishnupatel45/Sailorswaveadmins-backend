const {FormData} = require('../../models/user/applicatonform');

const HandilePostuser = async (req, res) => {
    try {
        let applicationId;
        let exists = true;

        // Generate a unique application ID
        while (exists) {
            applicationId = Math.floor(1000000000 + Math.random() * 9000000000);
            exists = await FormData.exists({ applicationId: applicationId });
        }
        const {
            applyFor, candidateName, fatherName, dob, gender, mobileNumber,
            email, houseNo, postOffice, policeStation, district, city, state,
            postalCode, tenthschool, tenthyear, tenthpercentage, twelfthschool,
            twelfthyear, twelfthpercentage, degreeschool, degreeyear, degreepercentage
        } = req.body;

        // Check if all required fields are filled
        if (!tenthschool || !mobileNumber || !degreepercentage || !degreeyear || !degreeschool || !twelfthyear ||
            !twelfthpercentage || !twelfthschool || !tenthpercentage || !tenthyear || !applyFor || !candidateName ||
            !fatherName || !dob || !gender || !mobileNumber || !email || !houseNo || !postOffice || !policeStation ||
            !district || !city || !state || !postalCode || !req.files['passport'] || !req.files['class10th'] || !req.files['aadhar']) {
            return res.status(400).send('Please fill all the fields.');
        }

        const newFormData = new FormData({
            applicationId: applicationId, applicationstatus: false,
            applyFor, candidateName, fatherName, dob, gender, mobileNumber, email, houseNo, postOffice, policeStation, district,
            city, state, postalCode, tenthschool, tenthyear, tenthpercentage, twelfthschool, twelfthyear, twelfthpercentage,
            degreeschool, degreeyear, degreepercentage,
            passport: new mongoose.Types.ObjectId(req.files['passport'][0].id),
            class10th: new mongoose.Types.ObjectId(req.files['class10th'][0].id),
            aadhar: new mongoose.Types.ObjectId(req.files['aadhar'][0].id)
        });

        // Save to the database
        await newFormData.save();
        res.status(200).json({ message: 'Form submitted successfully', data: newFormData });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Error submitting form.');
    }
}

const HandileGetuser = async (req, res) => {
    try {
        const candidates = await FormData.find({});
        if (!candidates || candidates.length === 0) {
            return res.status(404).send('No candidates found');
        }

        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).send('Error fetching candidates');
    }
}

const HandileUpdateuser = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await FormData.find({ applicationId: id });
        console.log('Candidate:', candidate); 
        if (!candidate) {
            return res.status(404).send('candidate not found');
        }
        candidate.applicationstatus = true;
        res.json(candidate);
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).send('Error fetching candidate.');
    }
}

module.exports = {
    HandileUpdateuser,
    HandileGetuser,
    HandilePostuser
}
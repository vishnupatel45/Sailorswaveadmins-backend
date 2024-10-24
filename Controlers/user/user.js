const { FormData } = require('../../models/user/applicatonform');
const mongoose = require('mongoose')

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
            applicationId: applicationId,
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
    const {
        Apstatus,
        ApOfficerName,
        admitcardstatus,
        admitcarddate,
        admitcardtime,
        admitcardofficer,
        interviewfeedback,
        interviewstatus,
        interviewofficer,
        selectionletterstatus,
        initialamount,
        deadlinedate,
        selectionletterofficer,
        confirmationletterstatus,
        instalment2amt,
        instalment3amt,
        instalment2dat,
        instalment3dat,
        confirmationletterofficer
    } = req.body; // Destructure all relevant fields from the request body
    console.log(instalment2amt,
        instalment3amt,
        instalment2dat,
        instalment3dat,'backend initalamount')
    try {
        const candidate = await FormData.findOne({ applicationId: id });
        console.log('Candidate:', candidate);

        if (!candidate) {
            return res.status(404).send('Candidate not found');
        }

        // Update the application status
        candidate.applicationstatus = {
            status: Apstatus,
            OfficerName: ApOfficerName
        };
        // Update the admit card status
        candidate.admitcard = {
            status: admitcardstatus,
            date: admitcarddate,
            time: admitcardtime,
            OfficerName: admitcardofficer
        };
        // Update the interview outcome details
        candidate.interviewoutcome = {
            interviewFeedback: interviewfeedback,
            status:interviewstatus,
            OfficerName: interviewofficer
        };
        // Update the selection letter status
        candidate.selectionletter = {
            status: selectionletterstatus,
            InitialAmount:initialamount,
            DeadlineDate:deadlinedate,
            OfficerName: selectionletterofficer
        };
        // Update the confirmation letter status
        candidate.confirmationletter = {
            status: confirmationletterstatus,
            InstalmentAmount2:instalment2amt,
            InstalmentAmount3:instalment3amt,
            InstalmentDate2:instalment2dat,
            InstalmentDate3:instalment3dat,
            OfficerName: confirmationletterofficer
        };

        await candidate.save(); // Save the updated candidate to the database
        res.json(candidate); // Return the updated candidate
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).send('Error updating candidate.');
    }
};




module.exports = {
    HandileUpdateuser,
    HandileGetuser,
    HandilePostuser
}
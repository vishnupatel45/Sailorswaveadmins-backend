const mongoose = require('mongoose');
const {Subadmin} = require('../../models/admin/subadmin')

const HandileGetAdmin =  async (req, res) => {
    try {
        // Use the Subadmin model directly
        const subadmin = await Subadmin.find();
        if (!subadmin) {
            return res.status(404).send('Subadmin not found.');
        }
        res.json(subadmin);
    } catch (error) {
        console.error('Error fetching subadmin:', error);
        res.status(500).send('Error fetching subadmin.');
    }
}

const HandileGetadminById = async (req, res) => {
    const { id } = req.params;
    try {
        // Use the Subadmin model directly
        const subadmin = await Subadmin.findById(id);
        if (!subadmin) {
            return res.status(404).send('Subadmin not found.');
        }
        res.json(subadmin);
    } catch (error) {
        console.error('Error fetching subadmin:', error);
        res.status(500).send('Error fetching subadmin.');
    }
}

const HandileDeleteadminById = async (req, res) => {
    try {
        const { id } = req.params;
        await Subadmin.findByIdAndDelete(id);
        res.status(200).json({ message: 'Subadmin deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subadmin', error });
    }
}

const HandileCreateadmin = async (req, res) => {
    try {
        const { name, email, number, password, MyApplication, AdmitCard, InterviewFeedback, SelectionLetter, ConfirmationLetter, Financialsletter } = req.body;

        if (!name || !email || !number || !password || !req.file) {
            return res.status(400).send("All fields are required, including the file.");
        }

        // Create a new subadmin entry with checklist fields
        const newSubadmin = new Subadmin({
            name,
            number,
            email,
            password,
            photoId: new mongoose.Types.ObjectId(req.file.id),  // Ensure using Mongoose's ObjectId
            checklist: {
                MyApplication: MyApplication === 'true',  // Convert string to boolean
                AdmitCard: AdmitCard === 'true',
                InterviewFeedback: InterviewFeedback === 'true',
                SelectionLetter: SelectionLetter === 'true',
                ConfirmationLetter: ConfirmationLetter === 'true',
                Financials: Financialsletter === 'true'
            }
        });

        // Save subadmin to the database
        await newSubadmin.save();
        res.status(200).json({ message: 'Subadmin created successfully', subadmin: newSubadmin });
    } catch (err) {
        console.error('Error creating subadmin:', err);
        res.status(500).send("Server error. Could not create subadmin.");
    }
}

const HandileUpdateadminById = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, number, email, password, MyApplication, AdmitCard, InterviewFeedback, SelectionLetter, ConfirmationLetter, Financials } = req.body;

        const updatedData = {
            name,
            number,
            email,
            password,
            checklist: {
                MyApplication: MyApplication === 'true',
                AdmitCard: AdmitCard === 'true',
                InterviewFeedback: InterviewFeedback === 'true',
                SelectionLetter: SelectionLetter === 'true',
                ConfirmationLetter: ConfirmationLetter === 'true',
                Financials: Financials === 'true',
            }
        };

        if (req.file) {
            updatedData.photoId = new mongoose.Types.ObjectId(req.file.id);
        }

        const updatedSubadmin = await Subadmin.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedSubadmin) {
            return res.status(404).json({ message: 'Subadmin not found.' });
        }

        res.status(200).json({ message: 'Subadmin updated successfully.', updatedSubadmin });
    } catch (error) {
        console.error('Error updating subadmin:', error);
        res.status(500).json({ message: 'Error updating subadmin', error });
    }
}

module.exports = {
    HandileGetAdmin,
    HandileGetadminById,
    HandileDeleteadminById,
    HandileCreateadmin,
    HandileUpdateadminById
}
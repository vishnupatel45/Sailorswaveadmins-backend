const { mainSubadmin } = require('../../models/subadmin/mainsubadmin');

//create a new subadmin
const HandileCreateSubadmin = async (req, res) => {
    try {
        const { adminEmail, adminPassword } = req.body;
        const admins = new mainSubadmin({
            adminEmail, adminPassword
        })
        await admins.save()
        res.status(200).json({ message: 'MainSubadmin created successfully', Mainsubadmin: admins });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Validation failed', error: error.message });
    }
}
//Login for subadmin
const HandileLoginsubadmin = async (req, res) => {
    try {
        const { adminEmail, adminPassword } = req.body;
        if (adminEmail && adminPassword) {
            const Mainsubadmin = await mainSubadmin.findOne({ adminEmail });
            if (Mainsubadmin && Mainsubadmin.adminPassword === adminPassword) {
                res.status(200).json({ message: 'Mainsubadmin found', mainsubadmin: Mainsubadmin });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(400).send("Email and password are required");
        }
    } catch (error) {
        console.error('Error fetching mainsubadmin:', error);
    }
}
//delete subadmin by id
const HandileDeleteById = async (req, res) => {
    try {
        const _id = req.params.id
        const admins = await mainSubadmin.findByIdAndDelete(_id);
        res.status(200).json({ message: 'MainSubadmin deleted successfully', admins })
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Validation failed', error: error.message });
    }
}
module.exports = {
    HandileLoginsubadmin,
    HandileCreateSubadmin,
    HandileDeleteById
}
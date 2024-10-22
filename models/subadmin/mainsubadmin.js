const mongoose = require('mongoose');

const submainadmin = new mongoose.Schema({
    adminEmail: { type: String, required: true, unique: true },
    adminPassword: { type: String, required: true }
});
const mainSubadmin = mongoose.model('subMainadmin', submainadmin);

module.exports = {
    mainSubadmin
}
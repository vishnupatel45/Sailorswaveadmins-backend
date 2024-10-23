const { getGfsBucket, conn } = require('../../Config/gfsbucket/gfsbucket');
const mongoose = require('mongoose');

const HandleGetFileByID = async (req, res) => {
    const { id } = req.params;  // Get the file ID from request parameters

    try {
        // Find the file by ID in the 'uploads.files' collection
        const file = await conn.db.collection('uploads.files').findOne({ _id: new mongoose.Types.ObjectId(id) });
        
        if (!file) {
            return res.status(404).send('File not found.');
        }

        // Get the initialized gfsBucket
        const gfsBucket = getGfsBucket();

        // Create a download stream for the file
        const downloadStream = gfsBucket.openDownloadStream(file._id);

        // Set response headers
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

        // Handle stream errors
        downloadStream.on('error', (err) => {
            console.error('Error streaming file:', err);
            res.status(500).send('Error streaming file.');
        });

        // Pipe the download stream to the response
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error fetching file by id:', error);
        res.status(500).send('Error fetching file.');
    }
}

module.exports = {
    HandleGetFileByID
};

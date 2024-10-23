const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/Sailors';  // Update with your database name
const conn = mongoose.createConnection(mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true });

let gfsBucket;

conn.once('open', () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('GridFSBucket initialized');
});

// Export a function that returns the initialized gfsBucket
const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error('gfsBucket is not initialized yet');
    console.log('gfsBucket:', gfsBucket);
  }
  return gfsBucket;
};

module.exports = { getGfsBucket,conn };

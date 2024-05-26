const { Readable } = require('stream');
const { Storage } = require('@google-cloud/storage');

// Initialize a storage instance
const storage = new Storage({
  keyFilename: 'google-storage-key.json',
  projectId: 'loja-online-979c4',
});

// Get a reference to the bucket
const bucket = storage.bucket('loja-online');

function uploadSingleFile(file, prod_ref) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
    }

    // Upload the file to Google Cloud Storage
    const gcsFileName = `${prod_ref}-${Date.now()}`;
    const gcsFile = bucket.file(gcsFileName);
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Create a readable stream from file buffer and pipe it to GCS
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null); // Signals the end of the stream

    bufferStream.pipe(stream)
      .on('error', (err) => {
        console.error('Error uploading to GCS:', err);
        reject('Error uploading to GCS');
      })
      .on('finish', () => {
        // File upload successful
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;
        resolve(imageUrl);
      });
  });
}

module.exports = { uploadSingleFile };

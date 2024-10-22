const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const archiver = require('archiver');
const { runPythonScript } = require('./helpers/runPythonScript');

const app = express();
const PROCESSED_DIR = path.resolve('fonts/');
const ZIP_FILE_PATH = path.join(__dirname, 'fonts.zip');

app.use(
  cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Set up multer to store file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

// Create a file filter to validate the file extension
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.ttf', '.otf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file type. Only .ttf and .otf are allowed.'));
  }
  cb(null, true);
};

// Create the upload middleware, applying the file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

/**
 * Processes the uploaded files and returns the paths of the generated font files.
 * @param {Array} files - Array of uploaded files.
 * @returns {Promise<Array>} - Resolves with an array of paths to processed font files.
 */
async function processFiles(files) {
  const promises = files.map((file) => {
    const filePath = path.resolve(file.path);
    return new Promise((resolve, reject) => {
      runPythonScript(
        './scripts/condense_font.py',
        [filePath, PROCESSED_DIR],
        (error, outputFontPath) => {
          if (error) {
            reject(error);
          } else {
            resolve(outputFontPath);
          }
        }
      );
    });
  });
  return Promise.all(promises);
}

/**
 * Creates a zip archive from the list of processed files.
 * @param {Array} outputFiles - Array of paths to processed font files.
 * @returns {Promise} - Resolves when the zip archive is successfully created.
 */
function createZipArchive(outputFiles) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ZIP_FILE_PATH);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (err) => reject(err));
    output.on('close', resolve);

    archive.pipe(output);
    outputFiles.forEach((file) => {
      archive.file(file, { name: path.basename(file) });
    });
    archive.finalize();
  });
}

/**
 * Handles file upload, processing, and returns a zip archive of the processed files.
 */
app.post('/condense-fonts', upload.array('files', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ error: 'No files were uploaded.' });
  }
  try {
    const processedFiles = await processFiles(req.files);
    await createZipArchive(processedFiles);
    res.download(ZIP_FILE_PATH, 'fonts.zip', (err) => {
      if (err) {
        console.error('Error sending zip: ', err);
      }
      // Clean up after sending the file
      fs.unlinkSync(ZIP_FILE_PATH);
    });
  } catch (error) {
    console.error('Error processing files: ', error);
    res.status(500).send({ error: 'Error processing files.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { runPythonScript } = require('./helpers/runPythonScript');

// Initialize Express
const app = express();

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
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

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// TODO: Handle input and output of multiple files (for ex. archive with regular, italic and bold fonts)
// TODO: Return filename to frontend
app.post('/condense-font', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const script = './scripts/condense_font.py';
  const inputFilePath = path.resolve(req.file.path);
  const outputDir = path.resolve(__dirname, 'fonts');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  runPythonScript(
    script,
    [inputFilePath, outputDir],
    (error, outputFontPath) => {
      if (error) {
        return res.status(500).json({ message: `Error: ${error.message}` });
      }

      // Serve the newly generated font file
      res.download(outputFontPath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err.message}`);
          res.status(500).json({ message: 'Error sending the file' });
        } else {
          console.log(`File sent: ${outputFontPath}`);
        }

        // Clean up the uploaded and generated files
        fs.unlink(inputFilePath, (err) => {
          if (err) {
            console.error(`Error deleting uploaded file: ${err.message}`);
          } else {
            console.log(`Uploaded file deleted: ${inputFilePath}`);
          }
        });

        fs.unlink(outputFontPath, (err) => {
          if (err) {
            console.error(`Error deleting generated file: ${err.message}`);
          } else {
            console.log(`Generated file deleted: ${outputFontPath}`);
          }
        });
      });
    }
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

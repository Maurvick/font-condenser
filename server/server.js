const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { runPythonScript } = require('./runPythonScript');

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

const upload = multer({ storage: storage });

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.post('/run-script', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.resolve(req.file.path);
  const outputDir = path.resolve(__dirname, 'generated_fonts');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Run the Python script
  runPythonScript(
    './condense_font.py',
    [filePath, outputDir],
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
      });
    }
  );
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

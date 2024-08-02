const express = require("express");
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  region: process.env.AWS_REGION_ID,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.post("/upload", upload.single("file"), (req, res) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME_ID,
    Key: "Resume.pdf",
    Body: req.file.buffer,
    ContentType: "application/pdf",
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "File uploaded successfully", data });
  });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const axios = require("axios");
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

//------------------------------------------------//

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

//------------------------------------------------//

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

//------------------------------------------------//

app.get("/summary", async (req, res) => {
  try {
    const url = "https://resume-help.vercel.app/summarize";
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching data from the external API" });
  }
});

//------------------------------------------------//

app.post("/score", async (req, res) => {
  try {
    const url = "https://resume-help.vercel.app/score";
    const formData = req.body;

    const response = await axios.post(url, formData);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending data to the external API" });
  }
});

//------------------------------------------------//

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

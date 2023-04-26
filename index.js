const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3005;
const http = require('http');
const fs = require('fs');
const path = require('path');
const indexRouter = require("./routes/index")
const nodemailer = require('nodemailer');

app.set('view engine', 'ejs');

require('dotenv').config();

app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/public/images/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'images', req.params.imageName);
  const imageStream = fs.createReadStream(imagePath);
  imageStream.pipe(res);
});

// Read PDF file and send as response
app.get('/public/pdf/:pdfName', (req, res) => {
  const pdfPath = path.join(__dirname, 'public', 'pdf', req.params.pdfName);
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error(`Failed to read PDF file: ${err}`);
      res.sendStatus(500);
      return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${req.params.pdfName}"`);
    res.send(data);
  });
});

const imagesDir = path.join(__dirname, 'public', 'images');
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error(`Failed to read images directory: ${err}`);
    return;
  }
  files.forEach(file => {
    const imageName = path.basename(file);
    app.get(`/public/images/${imageName}`, (req, res) => {
      const imagePath = path.join(imagesDir, file);
      const imageStream = fs.createReadStream(imagePath);
      imageStream.pipe(res);
    });
  });
});

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send', (req, res) => {
  const { fname, lname, email, number, message } = req.body;

  let userEmailAddress = req.body.email;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        type: 'OAuth2',
        user: userEmailAddress,
        clientId: '511328964924-4ks8djah7soiit6te20touo1j2riu8mq.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04zcctJyfqJQdCgYIARAAGAQSNwF-L9IrRIUwor-Z4Rp6LEQdmniD4oLXpsApg5NG9wPxmPzP41jmwDshsamKbbhT-7ct7BmtEPc',
        accessToken: 'ya29.Xx_XX0xya29.a0Ael9sCN-Pk_-mZ_WkyX86p1GFDQZkGvTaXZYaGjg-Dr-cI7_3Loy7cZzdmegW2M6uDjcXDd2aE90BLq35Qaa1Z6lttNu-XzBy917LZ8v8mnE4FHiWI1h25FBugUa0w9p9D802S2RQgexPapKp0iCAkwOcBNnaCgYKAVcSARISFQF4udJhv-bEScdlwmfhEYgoDqpSMA0163xxxx-xX0X0XxXXxXxXXXxX0x'
    }
});

  // send mail with defined transport object
  let mailOptions = {
    from: `"${fname} ${lname}" <${email}>`,
    to: 'networkmudiaga@gmail.com',
    subject: 'Contact Form Message',
    text: `
      Name: ${fname} ${lname}
      Email: ${email}
      Phone Number: ${number}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

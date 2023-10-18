const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// RabbitMQ connection URL
const rabbitMQUrl = 'amqp://localhost';

// Connect to RabbitMQ
amqp.connect(rabbitMQUrl)
  .then(connection => connection.createChannel())
  .then(channel => {
    const queue = 'email_queue';

    // Declare a queue
    channel.assertQueue(queue, { durable: false });

    // Consume messages from the queue
    channel.consume(queue, (message) => {
      const emailData = JSON.parse(message.content.toString());
      sendEmail(emailData);
    }, { noAck: true });
  })
  .catch(err => console.error(err));

function sendEmail(emailData) {
  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 't9023114@gmail.com', // Replace with your Gmail email address
      pass: 'gglgpxaswenzwzpl' // Replace with your Gmail password or an application-specific password
    }
  });

  // Email options
  const mailOptions = {
    from: 't9023114@gmail.com',
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.body
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}

app.listen(port, () => {
  console.log(`Email service is running on port ${port}`);
});
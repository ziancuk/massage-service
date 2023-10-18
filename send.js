const amqp = require('amqplib');

// RabbitMQ connection URL
const rabbitMQUrl = 'amqp://localhost';
const args = process.argv
const postEmail = args[2]
console.log(postEmail)
// Connect to RabbitMQ
amqp.connect(rabbitMQUrl)
  .then(connection => connection.createChannel())
  .then(channel => {
    const queue = 'email_queue';

    // Declare a queue
    channel.assertQueue(queue, { durable: false });

    // Message to be sent
    const emailData = {
      to: postEmail,
      subject: 'Test Email',
      body: 'This is a test email.'
    };

    // Send message to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)));
    console.log('Email message sent to the queue');
  })
  .catch(err => console.error(err));
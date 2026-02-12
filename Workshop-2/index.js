require('dotenv').config();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Course = require('./models/course');

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: '*'
}));

const mongoString = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

//Create a new course
app.post('/course', async (req, res) => {
  const course = new Course({
    name: req.body.name,
    credits: req.body.credits
  });

  try {
    const courseCreated = await course.save();
    res.header('Location', `/course?id=${courseCreated._id}`);
    res.status(201).json(courseCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get courses
app.get('/course', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Course.find();
      return res.status(200).json(data);
    }
    const data = await Course.findById(req.query.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update a course
app.put('/course', async (req, res) => {
  try {
    const course = await Course.findById(req.query.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found!!' });
    }
    course.name = req.body.name;
    course.credits = req.body.credits;
    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete a course
app.delete('/course', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.query.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found!!' });
    }
    res.status(200).json({ message: 'Course deleted successfully!!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`UTN API service listening on port ${PORT}!`));

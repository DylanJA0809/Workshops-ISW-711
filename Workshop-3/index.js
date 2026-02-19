require('dotenv').config();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Course = require('./models/course');
const Teacher = require('./models/teachers');

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

// Profesores
// Create
app.post('/teacher', async (req, res) => {
  const teacher = new Teacher({
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    cedula: req.body.cedula,
    edad: req.body.edad
  });

  try {
    const created = await teacher.save();
    res.status(201).json(created);
  } catch {
    res.status(400);
  }
});

// Get
app.get('/teacher', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Teacher.find();
      return res.status(200).json(data);
    }
    const data = await Teacher.findById(req.query.id);
    res.status(200).json(data);
  } catch {
    res.status(500);
  }
});

// Update
app.put('/teacher', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.query.id);
    if (!teacher) return res.status(404);

    teacher.nombre = req.body.nombre;
    teacher.apellidos = req.body.apellidos;
    teacher.cedula = req.body.cedula;
    teacher.edad = req.body.edad;

    const updated = await teacher.save();
    res.status(200).json(updated);
  } catch {
    res.status(500);
  }
});

// Delete
app.delete('/teacher', async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.query.id);
    if (!deleted) return res.status(404);

    res.status(200).json(deleted);
  } catch {
    res.status(500);
  }
});

// Cursos
// Create
app.post('/course', async (req, res) => {
  const course = new Course({
    nombre: req.body.nombre,
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    teacherId: req.body.teacherId
  });

  try {
    const created = await course.save();
    res.status(201).json(created);
  } catch {
    res.status(400);
  }
});

// Get 
app.get('/course', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Course.find();
      return res.status(200).json(data);
    }
    const data = await Course.findById(req.query.id);
    res.status(200).json(data);
  } catch {
    res.status(500);
  }
});

// Update
app.put('/course', async (req, res) => {
  try {
    const course = await Course.findById(req.query.id);
    if (!course) return res.status(404);

    course.nombre = req.body.nombre;
    course.codigo = req.body.codigo;
    course.descripcion = req.body.descripcion;
    course.teacherId = req.body.teacherId;

    const updated = await course.save();
    res.status(200).json(updated);
  } catch {
    res.status(500);
  }
});

// Delete
app.delete('/course', async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.query.id);
    if (!deleted) return res.status(404);

    res.status(200).json(deleted);
  } catch {
    res.status(500);
  }
});

app.listen(PORT, () => console.log(`UTN API service listening on port ${PORT}!`));

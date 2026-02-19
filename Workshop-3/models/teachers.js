const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  cedula: String,
  edad: Number,
});

module.exports = mongoose.model("Teacher", teacherSchema);

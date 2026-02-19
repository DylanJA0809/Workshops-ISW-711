const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  nombre: String,
  codigo: String,
  descripcion: String,
  teacherId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Course", CourseSchema);


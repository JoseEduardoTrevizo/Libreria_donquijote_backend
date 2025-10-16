const { Schema, model } = require("mongoose");

const BlogSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  calificacion: {
    type: Number,
    required: true,
    max: 5,
    min: 1,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

module.exports = model("Blog", BlogSchema, "blog");

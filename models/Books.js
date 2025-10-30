const { Schema, model } = require("mongoose");

const BooksSchema = new Schema({
  autor: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  editorial: {
    type: String,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
  disponible: {
    type: Boolean,
    required: true,
    default: true,
  },
  ingreso: {
    type: Date,
    default: Date.now,
  },
  descripcion: {
    type: String,
    required: false,
  },
  paginas: {
    type: Number,
    required: false,
  },

  precio: {
    type: String,
    required: false,
    default: "$$$",
  },
  imagen: {
    type: String,
    required: false,
    default: "/imagen/imagen_no-disponible.png",
  },
});

module.exports = model("Books", BooksSchema, "books");

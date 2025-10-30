const { Schema, model } = require("mongoose");

const EventosSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  lugar: {
    type: String,
    required: true,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
  },
});

EventosSchema.index(
  { fecha_creacion: 1 },
  { expireAfterSeconds: 2 * 24 * 60 * 60 }
); // Expira después de 2 días

module.exports = model("Eventos", EventosSchema, "Eventos");

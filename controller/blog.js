const validator = require("validator");
const Blog = require("../models/Blog");
const { validarDatosBlog } = require("../helpers/validar");

// Crear entrada de blog
const crearEntrada = async (req, res) => {
  try {
    let parametros = req.body;

    try {
      validarDatosBlog(parametros);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        mensaje: "Faltan datos por enviar o datos inválidos",
        error: error.message,
      });
    }

    let nuevaEntrada = new Blog(parametros);
    try {
      let entradaGuardada = await nuevaEntrada.save();
      return res.status(200).json({
        status: "success",
        mensaje: "Entrada de blog creada correctamente",
        entrada: entradaGuardada,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        mensaje: "Error al crear la entrada del blog",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const obtenerEntradas = async (req, res) => {
  try {
    let entradas = await Blog.find().sort({ fecha_creacion: -1 });

    if (!entradas || entradas.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No hay entradas de blog disponibles",
      });
    }

    return res.status(200).json({
      status: "success",
      total: entradas.length,
      entradas: entradas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const eliminarEntrada = async (req, res) => {
  try {
    let entradaId = req.params.id;

    try {
      const entradaEliminada = await Blog.findOneAndDelete({ _id: entradaId });

      if (!entradaEliminada) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se encontró la entrada de blog con el ID proporcionado",
        });
      }
      return res.status(200).json({
        status: "success",
        mensaje: "Entrada de blog eliminada correctamente",
        entrada: entradaEliminada,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        mensaje: "Error al eliminar la entrada del blog",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const editarEntrada = async (req, res) => {
  try {
    let entradaId = req.params.id;
    let parametros = req.body;

    try {
      validarDatosBlog(parametros);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        mensaje: "Faltan datos por enviar o datos inválidos",
        error: error.message,
      });
    }

    const entradaActualizada = await Blog.findOneAndUpdate(
      { _id: entradaId },
      parametros,
      { new: true }
    );

    if (!entradaActualizada) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontró la entrada de blog con el ID proporcionado",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Entrada de blog actualizada correctamente",
      entrada: entradaActualizada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

exports = module.exports = {
  crearEntrada,
  obtenerEntradas,
  eliminarEntrada,
  editarEntrada,
};

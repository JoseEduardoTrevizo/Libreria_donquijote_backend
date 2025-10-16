const validator = require("validator");
const Eventos = require("../models/Eventos");
const { validarDatosEvento } = require("../helpers/validar");

const crear = async (req, res) => {
  // Recoger parámetros por post a través del body
  let parametros = req.body;

  // Validar datos
  try {
    // Validar que los campos requeridos no estén vacíos
    let validar_titulo = validator.isEmpty(parametros.titulo || "");
    let validar_descripcion = validator.isEmpty(parametros.descripcion || "");
    let validar_fecha = validator.isEmpty(parametros.fecha || "");
    let validar_hora = validator.isEmpty(parametros.hora || "");
    let validar_lugar = validator.isEmpty(parametros.lugar || "");

    if (
      validar_titulo ||
      validar_descripcion ||
      validar_fecha ||
      validar_hora ||
      validar_lugar
    ) {
      throw new Error("Faltan datos por enviar o datos inválidos");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      mensaje: error.message,
    });
  }

  // Crear el objeto a guardar
  let evento = new Eventos(parametros);
  try {
    let eventoGuardado = await evento.save();
    return res.status(200).json({
      status: "success",
      mensaje: "Evento creado correctamente, se eliminará en 7 días",
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error al crear el evento",
    });
  }
};

// Listar Eventos
const listar_Eventos = async (req, res) => {
  try {
    // Sacar un listado de Eventos
    let Eventos_listados = await Eventos.find().sort({ fecha_creacion: -1 });

    // Si no hay Eventos
    if (!Eventos_listados || Eventos_listados.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "Sin Eventos para mostrar",
      });
    }
    return res.status(200).json({
      status: "success",
      total: Eventos_listados.length,
      Eventos: Eventos_listados,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error al listar los Eventos",
    });
  }
};

const eliminar_evento = async (req, res) => {
  // Recoger el id del evento a eliminar
  let eventoId = req.params.id;
  try {
    const eventoEliminado = await Eventos.findOneAndDelete({ _id: eventoId });
    // Validar el id
    if (!eventoEliminado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha especificado el ID del evento",
      });
    }
    return res.status(200).json({
      status: "success",
      eventoId: eventoId,
      mensaje: "Evento eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error al eliminar el evento",
    });
  }
};

const editar_evento = async (req, res) => {
  try {
    // Recoger el id del evento a editar
    let eventoId = req.params.id;
    // Recoger los datos que llegan por put
    let parametros = req.body;

    try {
      // Validar que los campos requeridos no estén vacíos
      validarDatosEvento(parametros);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        mensaje: "Faltan datos por enviar o datos inválidos",
        error: error.message,
      });
    }

    //Bucar  y actualizar el evento
    const eventoActualizado = await Eventos.findOneAndUpdate(
      { _id: eventoId },
      parametros,
      { new: true }
    );
    if (!eventoActualizado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Evento no encontrado",
      });
    }

    // Si todo es correcto
    return res.status(200).json({
      status: "success",
      mensaje: "Evento actualizado correctamente",
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el evento",
    });
  }
};

// Actualizar el evento

exports = module.exports = {
  crear,
  listar_Eventos,
  eliminar_evento,
  editar_evento,
};

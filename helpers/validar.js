const validator = require("validator");

const validarDatosEvento = (parametros) => {
  let validar_titulo = !validator.isEmpty(parametros.titulo || "");
  let validar_descripcion = !validator.isEmpty(parametros.descripcion || "");
  let validar_fecha = !validator.isEmpty(parametros.fecha || "");
  let validar_hora = !validator.isEmpty(parametros.hora || "");
  let validar_lugar = !validator.isEmpty(parametros.lugar || "");

  if (
    !validar_titulo ||
    !validar_descripcion ||
    !validar_fecha ||
    !validar_hora ||
    !validar_lugar
  ) {
    throw new Error("Faltan datos por enviar o datos inválidos");
  }
};

const validarDatosCatalogo = (parametros) => {
  // Validar que los campos requeridos no estén vacíos
  let validar_titulo = validator.isEmpty(parametros.titulo || "");
  let validar_autor = validator.isEmpty(parametros.autor || "");
  let validar_genero = validator.isEmpty(parametros.genero || "");
  let validar_editorial = validator.isEmpty(parametros.editorial || "");
  let validar_fecha_ingreso = validator.isEmpty(parametros.ingreso || "");
  let validar_num_paginas = !parametros.paginas || parametros.paginas <= 0;

  // Validar disponible como booleano
  let validar_disponible = typeof parametros.disponible !== "boolean";

  if (
    validar_titulo ||
    validar_autor ||
    validar_genero ||
    validar_editorial ||
    validar_disponible ||
    validar_fecha_ingreso ||
    validar_num_paginas
  ) {
    throw new Error("Faltan datos por enviar o datos inválidos");
  }

  // Validaciones adicionales opcionales
  if (
    parametros.paginas &&
    (!validator.isNumeric(parametros.paginas.toString()) ||
      parseInt(parametros.paginas) <= 0)
  ) {
    throw new Error("El número de páginas debe ser un número positivo");
  }
};

const validarDatosBlog = (parametros) => {
  let validar_nombre = !validator.isEmpty(parametros.nombre || "");
  let validar_titulo = !validator.isEmpty(parametros.titulo || "");
  let validar_autor = !validator.isEmpty(parametros.autor || "");
  let validar_categoria = !validator.isEmpty(parametros.categoria || "");
  let validar_descripcion = !validator.isEmpty(parametros.descripcion || "");

  let validar_calificacion =
    parametros.calificacion === undefined ||
    !validator.isInt(parametros.calificacion.toString(), { min: 1, max: 5 });

  if (
    !validar_nombre ||
    !validar_titulo ||
    !validar_autor ||
    !validar_categoria ||
    !validar_descripcion ||
    validar_calificacion
  ) {
    throw new Error("Faltan datos por enviar o datos inválidos");
  }
};

module.exports = {
  validarDatosEvento,
  validarDatosCatalogo,
  validarDatosBlog,
};

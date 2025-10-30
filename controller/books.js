const validator = require("validator");
const Book = require("../models/Books");
const fs = require("fs");
const path = require("path");
const { validarDatosCatalogo } = require("../helpers/validar");

const crear = async (req, res) => {
  // Recoger parámetros por post a través del body
  let parametros = req.body;

  // Validar datos
  try {
    validarDatosCatalogo(parametros);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      mensaje: error.message,
    });
  }

  if (
    !parametros.descripcion ||
    validator.isEmpty(parametros.descripcion.trim())
  ) {
    parametros.descripcion = "No hay descripcion";
  }
  // Crear el objeto a guardar
  let book = new Book(parametros);

  // Guardar el libro
  try {
    const bookGuardado = await book.save();
    return res.status(201).json({
      status: "success",
      book: bookGuardado,
      mensaje: "Libro creado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error al crear el libro",
      error: error.message,
    });
  }
};

// Listar todos los libros
const catalogo = async (req, res) => {
  try {
    const libros = await Book.find().sort({ ingreso: -1 }); // Ordenar por fecha de ingreso descendente

    if (!libros || libros.length === 0) {
      // No hay libros disponibles
      return res.status(404).json({
        status: "error",
        mensaje: "No hay libros disponibles",
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      total: libros.length,
      libros: libros,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al obtener el catálogo",
      error: error.message,
    });
  }
};

const recien_llegados = async (req, res) => {
  try {
    const libros = await Book.find().sort({ ingreso: -1 }).limit(4); // Obtener los 4 libros más recientes

    if (!libros || libros.length === 0) {
      // No hay libros disponibles
      return res.status(404).json({
        status: "error",
        mensaje: "No hay libros disponibles",
      });
    }
    // Devolver resultado
    return res.status(200).json({
      status: "success",
      total: libros.length,
      libros: libros,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al obtener los libros recién llegados",
      error: error.message,
    });
  }
};

const borrar = async (req, res) => {
  // Recoger el id de la url
  let bookId = req.params.id;

  try {
    // Buscar el libro por id y eliminarlo
    const bookBorrado = await Book.findByIdAndDelete({ _id: bookId });

    // Si no se encuentra el libro
    if (!bookBorrado) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el libro",
      });
    }
    // Devolver resultado
    return res.status(200).json({
      status: "success",
      book: bookBorrado,
      mensaje: "Libro borrado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al borrar el libro",
      error: error.message,
    });
  }
};

const editar_catalogo = async (req, res) => {
  try {
    // Recoger el id del libro a editar
    let bookId = req.params.id;
    // Recoger los datos que llegan por put
    let parametros = req.body;

    try {
      validarDatosCatalogo(parametros);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        mensaje: "Faltan datos por enviar o datos inválidos",
        error: error.message,
      });
    }

    //Bucar  y actualizar el libro
    const bookActualizado = await Book.findOneAndUpdate(
      { _id: bookId },
      parametros,
      { new: true }
    );

    if (!bookActualizado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Libro no encontrado",
      });
    }

    // Devolver respuesta
    return res.status(200).json({
      status: "success",
      book: bookActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el libro",
      error: error.message,
    });
  }
};

const buscar_libro = async (req, res) => {
  try {
    let busqueda = req.params.busqueda;

    // Validar que la búsqueda no esté vacía
    if (!busqueda || busqueda.trim() === "") {
      return res.status(400).json({
        status: "error",
        mensaje: "Ingrese un libro o autor de búsqueda",
      });
    }

    // Escapar caracteres especiales en la búsqueda
    const busquedaEscapada = busqueda.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const books = await Book.find({
      $or: [
        { titulo: { $regex: busquedaEscapada, $options: "i" } },
        { autor: { $regex: busquedaEscapada, $options: "i" } },
        { genero: { $regex: busquedaEscapada, $options: "i" } },
      ],
    }).sort({ ingreso: -1 });

    //verificar si se encontraron libros
    if (!books || books.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontraron libros que coincidan con la búsqueda",
        busqueda: busqueda,
      });
    }

    // Devolver resultado
    return res.status(200).json({
      status: "success",
      total: books.length,
      libros: books,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar el libro",
      error: error.message,
    });
  }
};

const subir = async (req, res) => {
  //Configurar multer

  //Recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion invalida, no se ha subido ningun archivo",
    });
  }

  //Nombre del fichero
  let archivo = req.file.originalname;

  //Extension del fichero
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];
  //Comprobar la extension, si no es valida borrar fichero y devolver error
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "webp"
  ) {
    //Borrar fichero subido
    fs.unlink(req.file.path, (err) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Formato no valido",
      });
    });
  } else {
    //Si todo es valido, guardar imagen en base de datos

    try {
      // Recoger el id del libro a editar
      let bookId = req.params.id;

      //Bucar  y actualizar el libro
      const bookActualizado = await Book.findOneAndUpdate(
        { _id: bookId },
        { imagen: req.file.filename },
        { new: true }
      );

      if (!bookActualizado) {
        return res.status(404).json({
          status: "error",
          mensaje: "Libro no encontrado",
        });
      }

      // Devolver respuesta
      return res.status(200).json({
        status: "success",
        book: bookActualizado,
        file: req.file,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error al actualizar el libro",
        error: error.message,
      });
    }
  }
};

const imagen = async (req, res) => {
  let fichero = req.params.fichero;

  let ruta_fisica = "./imagen/books/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
      });
    }
  });
};
module.exports = {
  crear,
  catalogo,
  recien_llegados,
  borrar,
  editar_catalogo,
  buscar_libro,
  subir,
  imagen,
};

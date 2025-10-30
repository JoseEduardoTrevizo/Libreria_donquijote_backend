const express = require("express");
const router = express.Router();
const booksController = require("../controller/books");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagen/books"); // Carpeta donde se guardarán las imágenes subidas
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const upload = multer({ storage: storage });

router.post("/crear_libro", booksController.crear);

router.put("/editar_libro/:id", booksController.editar_catalogo); // Nueva ruta para editar un libro por ID
router.delete("/borrar/:id", booksController.borrar); // Nueva ruta para borrar un libro por ID
router.get("/buscar/:busqueda", booksController.buscar_libro); // Nueva ruta para buscar libros por título o autor

router.get("/libros", booksController.catalogo); // Nueva ruta para listar todos los libros
router.get("/recien_llegados", booksController.recien_llegados); // Nueva ruta para libros recién llegados

router.post(
  "/subir_imagen/:id",
  [upload.single("imagen0")],
  booksController.subir
); // Nueva ruta para subir imagen de un libro
router.get("/imagen/:fichero", booksController.imagen); // Nueva ruta para servir imágenes de libros
module.exports = router;

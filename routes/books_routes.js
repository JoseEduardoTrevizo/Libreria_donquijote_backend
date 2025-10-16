const express = require("express");
const router = express.Router();
const booksController = require("../controller/books");

router.post("/crear_libro", booksController.crear);

router.put("/editar_libro/:id", booksController.editar_catalogo); // Nueva ruta para editar un libro por ID
router.delete("/borrar/:id", booksController.borrar); // Nueva ruta para borrar un libro por ID
router.get("/buscar/:busqueda", booksController.buscar_libro); // Nueva ruta para buscar libros por título o autor

router.get("/libros", booksController.catalogo); // Nueva ruta para listar todos los libros
router.get("/recien_llegados", booksController.recien_llegados); // Nueva ruta para libros recién llegados

module.exports = router;

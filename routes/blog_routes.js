const express = require("express");
const router = express.Router();
const BlogController = require("../controller/blog");

router.post("/nueva_recomendacion", BlogController.crearEntrada); // Crear entrada de blog
router.get("/", BlogController.obtenerEntradas); // Listar entradas de blog
router.delete("/eliminar_entrada/:id", BlogController.eliminarEntrada); // Eliminar entrada de blog
router.put("/editar_entrada/:id", BlogController.editarEntrada); // Editar entrada de blog

module.exports = router;

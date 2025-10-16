const express = require("express");
const router = express.Router();
const eventsController = require("../controller/events");

router.post("/crear_evento", eventsController.crear); // Crear evento
router.get("/eventos", eventsController.listar_Eventos); // Listar eventos actuales
router.put("/editar_evento/:id", eventsController.editar_evento); // Editar evento por ID
router.delete("/borrar_evento/:id", eventsController.eliminar_evento); // Borrar evento por ID

module.exports = router;

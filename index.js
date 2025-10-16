const { dbConnection } = require("./database/conenection");
const express = require("express");
const cors = require("cors");

//Coneccion a la base de datos
dbConnection();

//Crear un serividor de express
const app = express();
const port = 5173;

//Configurar cors
app.use(cors());

app.use(express.json()); //recibir datos contet-type application/json
app.use(express.urlencoded({ extended: true })); //recibir datos contet-type application/x-www-form-urlencoded

//Rutas
const routesBooks = require("./routes/books_routes");
const routesEvents = require("./routes/events_routes");
const routesBlog = require("./routes/blog_routes");

app.use("/books", routesBooks);
app.use("/events", routesEvents);
app.use("/blog", routesBlog);
app.use("/admin", routesBooks, routesEvents);
//Crear un middleware para leer json
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

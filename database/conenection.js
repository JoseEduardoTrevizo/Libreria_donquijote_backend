const moonoose = require("mongoose");

const dbConnection = async () => {
  try {
    await moonoose.connect("mongodb://localhost:27017/Libreria_DonQuijote");
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = { dbConnection };

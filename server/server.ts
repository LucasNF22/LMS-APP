import { app } from "./app";
require("dotenv").config();

// Server
app.listen(process.env.PORT, () =>{
    console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});


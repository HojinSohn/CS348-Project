const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const testRoutes = require("./routes/test");
const AuthRoutes = require("./routes/AuthRoute");
const RecipeRoutes = require("./routes/RecipeRoute");
const IngredientRoutes = require("./routes/IngredientRoute");
const {getRecipe, createRecipe} = require("./controllers/RecipeController");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readConcern: { level: 'local' }, // Isolation level : read uncommited with the read concern of level "local"
    writeConcern: { w: 'majority' } // Write concern: 'majority' (acknowledged by majority)
})
.then(() => console.log('DB CONNECTED'))
.catch((err) => console.log("DB NOT CONNECTED", err))

const port = process.env.PORT || 8080;
const server = app.listen(port, () =>
    console.log(`Server is running on port ${port}`)
);

app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

// app.use(morgan("dev"));
app.use(express.json());
// app.use(cors({ origin : true , credentials : true }));

app.use("/", testRoutes);
app.use("/auth", AuthRoutes);
app.use("/recipe", RecipeRoutes);
app.use("/ingredient", IngredientRoutes);
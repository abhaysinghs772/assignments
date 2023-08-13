/* Global imports */
import express from "express";
import cors from "cors";

/* Db */
import sequelize from './models/db.js';

async function init() {
    await sequelize.sync();
    console.log('Database synced');
}
init().catch((err) => {
    console.error('Error syncing database:', err);
});

/* Routes */
import recordsRoutes from "./routes/records.routes.js";

const port = 3000;
const app = express();

app.get('/', (req, res) => { res.send("hello world") });

/* ALLOW CORs */
app.use(cors());

app.use(express.json());

app.use('/api/v1', recordsRoutes);

app.listen(port, () => {
    console.log(`server is up at port : ${port}`);
})

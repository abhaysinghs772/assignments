/* Global imports */
import express from "express";
import cors from "cors";

/* Db */
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/crud-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

/* Routes */
import recordsRoutes from "./routes/records.routes.js";

const port = 3002 || process.env.PORT;
const app = express();

app.get('/', (req, res) => { res.send("hello world") });

/* ALLOW CORs */
app.use(cors());

app.use(express.json());

app.use('/api/v1', recordsRoutes);

app.listen(port, () => {
    console.log(`server is up at port : ${port}`);
})

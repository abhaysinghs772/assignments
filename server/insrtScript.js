import Record from "./src/models/db.js";
import mongoose from "mongoose";

const data = [
    {
        id: 1,
        fullName: 'Susan',
        phone: '1234567890',
        email: 'susan@example.com',
        hobbies: '95000',
        date: '2019-04-11',
    },
    {
        id: 2,
        fullName: 'Adrienne',
        phone: '1234567890',
        email: 'adrienne@example.com',
        hobbies: '80000',
        date: '2019-04-17',
    },
    {
        id: 3,
        fullName: 'Rolf',
        phone: '1234567890',
        email: 'rolf@example.com',
        hobbies: '79000',
        date: '2019-05-01',
    },
    {
        id: 4,
        fullName: 'Kent',
        phone: '1234567890',
        email: 'kent@example.com',
        hobbies: '56000',
        date: '2019-05-03',
    },
    {
        id: 5,
        fullName: 'Arsenio',
        phone: '1234567890',
        email: 'arsenio@example.com',
        hobbies: '65000',
        date: '2019-06-13',
    },
    {
        id: 6,
        fullName: 'Laurena',
        phone: '1234567890',
        email: 'laurena@example.com',
        hobbies: '120000',
        date: '2019-07-30',
    },
    {
        id: 7,
        fullName: 'George',
        phone: '1234567890',
        email: 'george@example.com',
        hobbies: '90000',
        date: '2019-08-15',
    },
    {
        id: 8,
        fullName: 'Jesica',
        phone: '1234567890',
        email: 'jesica@example.com',
        hobbies: '60000',
        date: '2019-10-10',
    },
    {
        id: 9,
        fullName: 'Matthew',
        phone: 'Warren',
        email: 'matthew@example.com',
        hobbies: '71000',
        date: '2019-10-15',
    },
    {
        id: 10,
        fullName: 'Lyndsey',
        phone: '1234567890',
        email: 'lyndsey@example.com',
        hobbies: '110000',
        date: '2020-01-15',
    },
];

mongoose.connect('mongodb://localhost:27017/crud-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

try {
    let savedMany = await Record.insertMany(data);
    console.log(savedMany);
} catch (error) {
    console.log(error);
}
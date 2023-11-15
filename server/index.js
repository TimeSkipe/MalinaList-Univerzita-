import express from 'express';
import mongoose from 'mongoose';
import {PORT, MongoDB, CorsDomen} from './connecting/connect.js';
import cors from 'cors';
import routerUser from"./User/register.js"
import routerList from"./list/list.js"
import routerItem from './list/item.js';
import routerUsero from './list/user.js';


const app = express();
app.use(express.json());


// Pripojeni k MongoDB
mongoose.connect(MongoDB,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Підключено до бази даних');
  })
  .catch(error => {
    console.error('Помилка підключення до бази даних', error);
  });

// Pouziti Cors
app.use(cors({
  origin: CorsDomen,
}))

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use(routerUser)
app.use(routerList)
app.use(routerItem)
app.use(routerUsero)


// Server start
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
import express from "express";
import User from "../User/SchemsUser.js";

const routerUser = express.Router();


//Registrace usera na web stranke
routerUser.post('/register', (req, res) => {

    const { name, email, password, thema } = req.body;
  
    User.findOne({ email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).json({ error: 'Користувач з цим email вже існує' });
        }
  
        const newUser = new User({ name, email, password, thema });
  
        newUser.save()
          .then(savedUser => {
            res.json({ message: 'Користувач успішно зареєстрований', user: savedUser });
          })
          .catch(error => {
            console.error('Помилка збереження користувача', error);
            res.status(500).json({ error: 'Сталась помилка на сервері' });
          });
      })
      .catch(error => {
        console.error('Помилка пошуку користувача', error);
        res.status(500).json({ error: 'Сталась помилка на сервері' });
      });
  });


// Autorizace Usera
routerUser.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    User.findOne({ email })
      .then(existingUser => {

        if (!existingUser) {
          return res.status(400).json({ error: 'Невірний email або пароль' });
        }
  
        if (existingUser.password !== password) {
          return res.status(400).json({ error: 'Невірний email або пароль' });
        }
  
        res.json({ message: 'Користувач успішно авторизований', user: existingUser });
      })
      .catch(error => {
        console.error('Помилка авторизації', error);
        res.status(500).json({ error: 'Сталась помилка на сервері' });
      });
  });
  export default routerUser;
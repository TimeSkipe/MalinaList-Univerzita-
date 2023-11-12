import express from "express";
import User from "../User/SchemsUser.js";
const routerUser = express.Router();

routerUser.post('/register', (req, res) => {
    // Отримання даних з тіла запиту
    const { name, email, password, thema } = req.body;
  
    // Перевірка, чи існує користувач з таким email
    User.findOne({ email })
      .then(existingUser => {
        if (existingUser) {
          // Користувач з таким email вже існує
          return res.status(400).json({ error: 'Користувач з цим email вже існує' });
        }
  
        // Створення нового користувача
        const newUser = new User({ name, email, password, thema });
  
        // Збереження нового користувача в базі даних
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

  routerUser.post('/login', (req, res) => {
    // Отримання даних з тіла запиту
    const { email, password } = req.body;
  
    // Пошук користувача за email
    User.findOne({ email })
      .then(existingUser => {
        if (!existingUser) {
          // Користувача з таким email не знайдено
          return res.status(400).json({ error: 'Невірний email або пароль' });
        }
  
        // Перевірка пароля
        if (existingUser.password !== password) {
          // Невірний пароль
          return res.status(400).json({ error: 'Невірний email або пароль' });
        }
  
        // Користувач успішно авторизований
        res.json({ message: 'Користувач успішно авторизований', user: existingUser });
      })
      .catch(error => {
        console.error('Помилка авторизації', error);
        res.status(500).json({ error: 'Сталась помилка на сервері' });
      });
  });
  export default routerUser;
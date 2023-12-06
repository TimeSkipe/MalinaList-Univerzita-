import express from "express";
import User from "../User/SchemsUser.js";
import List from "./schemaList.js";


const routerUsero = express.Router();


//Dostani vsychnych userov z DB
routerUsero.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } 
    catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    }
  });


// Pridani user(IdUser) do listu memberu v urciteho senamu podle IdSeznamu a  
routerUsero.post('/addMemberToList/:listId/:userId', async (req, res) => {
    try {
      const { listId, userId } = req.params;
      const list = await List.findById(listId);
  
      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      list.members.push({
        userId: user._id,
        namemember: user.name,
        email: user.email,
      });

      await list.save();
  
      res.status(200).json({ message: 'User added to the list successfully' });
    } 
    catch (error) {
      console.error('Error adding user to the list:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Delete userov ze seznamu
routerUsero.delete('/deleteUser', async (req, res) => {
    const { listId, email } = req.body;
  
    try {
      const updatedList = await List.findByIdAndUpdate(
        listId,
        {
          $pull: { members: { email: email } },
        },
        { new: true }
      );
  
      if (updatedList) {
        res.status(200).json({ message: 'User deleted from the list successfully' });
      } 
      else {
        res.status(404).json({ error: 'List not found' });
      }
    } 
    catch (error) {
      console.error('Error deleting user from the list:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  routerUsero.put('/changeLanguage/:id/:lan', async (req, res) => {
    try {
      const { id: userId, lan } = req.params;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Оновлення мови користувача
      user.lan = lan;
      await user.save();
  
      res.json(user);
    } catch (error) {
      console.error('Error updating resolved:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  routerUsero.get('/userlanAndThem/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ lan: user.lan, thema: user.thema });
    } catch (error) {
      console.error('Error getting user language', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  routerUsero.put('/changeThema/:id/:thema', async (req, res) => {
    try {
      const { id: userId, thema } = req.params;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Оновлення мови користувача
      user.thema = thema;
      await user.save();
  
      res.json(user);
    } catch (error) {
      console.error('Error updating resolved:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  export default routerUsero;
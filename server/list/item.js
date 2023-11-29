import express from "express";
import List from "../list/schemaList.js"


const routerItem = express.Router();

// Pridani zbozi do seznamu podle IdSeznamu
routerItem.post('/addItem/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, resolved } = req.body;
      const list = await List.findById(id);

      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
  
      const newItem = {
        titleitem: title,
        descitem: description,
        resolved: resolved,
      };

      list.items.push(newItem);
      await list.save();
      res.status(201).json({ newItem });
    } 
    catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Vymazani zbozi podle IdZbozi z urciteho seznamu podle IdSeznamu
routerItem.delete('/deleteItem/:listId/:itemId', async (req, res) => {
    const { listId, itemId } = req.params;
  
    try {
      const list = await List.findById(listId);
  
      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }
  
      const itemIndex = list.items.findIndex((item) => item.id === itemId);
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      list.items.splice(itemIndex, 1);
  
      await list.save();
      res.json({ message: 'Item deleted successfully' });
    } 
    catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


// Zmena stavu Resolved v konkretnim zbozi
routerItem.put('/updateResolved/:id/:itemId', async (req, res) => {
    try {
      const { id, itemId } = req.params;
      const list = await List.findById(id);

      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }

      const item = list.items.find(item => item._id.toString() === itemId);

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      item.resolved = !item.resolved;
      await list.save();
      res.json({ message: 'Updated successfully', newItem: item });
    } 
    catch (error) {
      console.error('Error updating resolved:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


// Uprava nazmu a description konkretneho zbozi podle IdItem v urcitem seznamu podle IdSeznam
routerItem.put('/updateItem/:listId/:itemId', async (req, res) => {
  const { listId, itemId } = req.params;
  const { titleitem, descitem } = req.body;

  try {
      const list = await List.findById(listId);
      const itemToUpdate = list.items.id(itemId);

      if (itemToUpdate) {
          if (titleitem !== "") {
              itemToUpdate.titleitem = titleitem;
          }
          if (descitem !== "") {
              itemToUpdate.descitem = descitem;
          }
      } 
      else {
          return res.status(404).json({ message: 'Item not found' });
      }

      const updatedList = await list.save();

      res.json({ updatedList });
  } 
  catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

  export default routerItem

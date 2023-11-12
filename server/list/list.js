import express from "express";
import List from "../list/schemaList.js"
const routerList = express.Router();
routerList.post('/createList', async (req, res) => {
    const newList = new List({
        listname: req.body.listname,
        selectedOption: req.body.selectedOption,
        creator: req.body.creator,
        archive: req.body.archive,
    });

    try {
        const savedList = await newList.save();
        res.json(savedList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
routerList.get('/getoList', async (req,res)=>{
    try {
        const Lists = await List.find();
        res.json(Lists)
    } catch (error) {
        console.error('Error retrieving users', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
})
routerList.delete('/deleteList/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedList = await List.findByIdAndRemove(id);
        if (!deletedList) {
            return res.status(404).json({ error: 'List not found' });
        }

        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ error: 'Failed to delete list' });
    }
});
routerList.put('/archive/:id', async (req, res) => {
    const listId = req.params.id;
    const { archive } = req.body;

    try {
        const updatedList = await List.findByIdAndUpdate(
            listId,
            { archive },
            { new: true } // Повертає оновлений об'єкт після збереження
        );

        res.json(updatedList);
    } catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ error: 'Failed to update list' });
    }
});
routerList.get('/getList/:id', async (req, res) => {
    const listId = req.params.id;

    try {
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json(list);
    } catch (error) {
        console.error('Error retrieving list by ID:', error);
        res.status(500).json({ error: 'Failed to retrieve list' });
    }
});


export default routerList;
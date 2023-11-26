import express from "express";
import List from "../list/schemaList.js"


const routerList = express.Router();


// Vytvoreni seznamu
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
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Dostani seznamu z DB
routerList.get('/getoList', async (req,res)=>{
    try {
        const Lists = await List.find();
        res.json(Lists)
    } catch (error) {
        console.error('Error retrieving users', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
})


// Vymazani seznamu podle IdSeznam
routerList.delete('/deleteList/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedList = await List.findByIdAndRemove(id);

        if (!deletedList) {
            return res.status(404).json({ error: 'List not found' });
        }

        res.json({ message: 'List deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ error: 'Failed to delete list' });
    }
});


// Archivovani seznamu
routerList.put('/archive/:id', async (req, res) => {

    const listId = req.params.id;
    const { archive } = req.body;

    try {
        const updatedList = await List.findByIdAndUpdate(
            listId,
            { archive },
            { new: true }
        );

        res.json(updatedList);
    } 
    catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ error: 'Failed to update list' });
    }
});


//Dostani listu podle IdSeznam na prechod k konkretnimu seznamu
routerList.get('/getList/:id', async (req, res) => {
    const listId = req.params.id;

    try {
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json(list);
    } 
    catch (error) {
        console.error('Error retrieving list by ID:', error);
        res.status(500).json({ error: 'Failed to retrieve list' });
    }
});

//Zmena nazvu a icon seznamu
routerList.put('/EditList/:id', async (req, res) => {
    const listId = req.params.id;
    const { listname, selectedOption } = req.body;

    // Перевірка, чи всі обов'язкові поля не пусті
    if ((listname === undefined || listname === null) && (selectedOption === undefined || selectedOption === null)) {
        return res.status(400).json({ error: 'Будь ласка, заповніть хоча б одне поле' });
    }

    try {
        // Отримання поточного запису з бази даних
        const currentList = await List.findById(listId);

        // Оновлення запису в базі даних з урахуванням того, що поля можуть бути пустими
        const updatedList = await List.findByIdAndUpdate(listId, {
            listname: listname !== undefined ? listname : currentList.listname,
            selectedOption: selectedOption !== undefined ? selectedOption : currentList.selectedOption,
        }, { new: true });

        // Відправлення відповіді із оновленим списком
        res.json(updatedList);
    } catch (error) {
        console.error('Помилка оновлення списку:', error);
        res.status(500).json({ error: 'Помилка оновлення списку' });
    }
});


export default routerList;

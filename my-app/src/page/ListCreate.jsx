import React, { useState } from 'react';
import "../style/CreateList.css"
import { useNavigate } from 'react-router-dom';
import { People, Card, Calender,Pin } from "../files/svg";
import { PORT } from "../connect/connect";

const CreateList =(props) =>{
    const navigate = useNavigate();

    /* selectedOption vyber urciteho icon */
    const [selectedOption, setSelectedOption] = useState('');
    /* Nazev seznamu */
    const [listname, setListName] = useState('');
    /* status seznamu archive, nebo ne */
    const[archive, setArchive] = useState(false);

    /* Forma na vytvareni seznamu */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            listname,
            selectedOption:selectedOption,
            creator:props.username.email,
            archive:archive,
        };

        try {
            const response = await fetch(`${PORT}/createList`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            const responseData = await response.json();
            console.log(responseData);
            setListName("");
            setSelectedOption("");
            navigate('/Lists');
        } 
        catch (error) {
            console.error("Error sending data to server:", error);
        }
    }
    
    return(
        <div>
                <div className="CreateBar">
                    <div className="TitlePage">Create List</div>
                    <div className="CreateFrom">

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="List`s name"
                                value={listname}
                                onChange={(e) => setListName(e.target.value)}
                            />
                            <div>

                                <label htmlFor="people">
                                    <People />
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='people'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>
                                <label htmlFor="Card">
                                    <div><Card /></div>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='Card'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>
                                <label htmlFor="Calender">
                                    <div><Calender /></div>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='Calender'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>
                                <label htmlFor="Pin">
                                    <div><Pin /></div>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='Pin'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>

                            </div>

                            <button type="submit">Create list</button>

                        </form>
                    </div>
                </div>
            </div>
    )
}
export default CreateList
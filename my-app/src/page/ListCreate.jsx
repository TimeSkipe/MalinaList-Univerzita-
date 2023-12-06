import React, { useState } from 'react';
import "../style/CreateList.css"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BackButtonSVG} from '../files/svg';
import { People, Card, Calender,Pin } from "../files/svg";
import { PORT } from "../connect/connect";
import language from '../language/language';

const CreateList = (props) =>{
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
                    
                    <div className="TitlePage Text-Color">
                    <Link to='/Lists' className='ButtonBack'>
                        <BackButtonSVG  className={'SVG-main-color'}/>
                    </Link>
                    {props.lan ? language[props.lan].ListCreate.CreateList : language.English.ListCreate.CreateList}</div>
                    <div className="CreateFrom Second-color">

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder={props.lan ? language[props.lan].ListCreate.ListName : language.English.ListCreate.ListName}
                                value={listname}
                                onChange={(e) => setListName(e.target.value)}
                                required
                                className='Second-color Text-Color'
                            />
                            <div>

                                <label htmlFor="people" className='LabelIcon Active-color'>
                                    <People  className={'SVG-main-color'}/>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='people'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>
                                <label htmlFor="Card" className='LabelIcon Active-color'>
                                    <Card  className={'SVG-main-color'}/>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='Card'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>
                                <label htmlFor="Calender" className='LabelIcon Active-color'>
                                    <Calender  className={'SVG-main-color'}/>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='Calender'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>
                                <label htmlFor="Pin" className='LabelIcon Active-color'>
                                    <Pin  className={'SVG-main-color'}/>
                                    <input
                                        type="radio"
                                        name="radio"
                                        id='Pin'
                                        onChange={(e) => setSelectedOption(e.target.id)}
                                    />
                                </label>

                            </div>

                            <button type="submit" className='Text-Color Third-Color'>{props.lan ? language[props.lan].ListCreate.CreateNewList : language.English.ListCreate.CreateNewList}</button>

                        </form>
                    </div>
                </div>
            </div>
    )
}
export default CreateList
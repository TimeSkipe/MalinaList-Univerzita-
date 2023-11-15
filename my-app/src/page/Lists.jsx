import React, { useState, useEffect } from 'react';
import "../style/lists.css"
import { Link } from 'react-router-dom';
import { PORT } from "../connect/connect";
import { People, Card, Calender,Pin, ArchiveSVG, EditButtonSVG, DeleteButtonSVG, PlusSVG } from "../files/svg";
const Lists = (props) =>{ 

    const[Listo, setListo] = useState([]);
    const[showArchiveLists, setShowArchiveLists] = useState(true)
    /* Get request do DB na gain data list */
    useEffect(()=>{
        const ListInfa = async () =>{
            try {
                const response = await fetch(`${PORT}/getoList`);
                const data = await response.json();
                setListo(data);
            } catch (error) {
                console.log('Error', error)
            }
        }
        ListInfa();
        
    },[])

    /* Funkce na ukazovani urciteho icon podle selected z databazi */
    const SwichFun = (selected) =>{
        switch (selected) {
            case "people":
                return <People/>
            case "Card":
                    return <Card/>
            case "Calender":
                return <Calender/>
            case "Pin":
                return <Pin/>
            default:
                break;
        }
    }

    /* Button na vymazeni seznamu */
    const DeleteButton = async (id)=>{

        /* Forma na stvrzeni */
        const isConfirmed = window.confirm('Are you sure you want to remove this list');
        if (!isConfirmed) {
        return;
        }   

        try {
            const response = await fetch(`${PORT}/deleteList/${id}`, {
                method: 'DELETE',
            });

            const responseData = await response.json();
            console.log(responseData);
            window.location.reload();
        } 
        catch (error) {
            console.error('Error deleting list:', error);
        }
    }

    /* Button na archivovani seznamu */
    const ArchiveButton = async (id, ArchiveStatus) => {
        try {
            const response = await fetch(`${PORT}/archive/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ archive: !ArchiveStatus }),
            });
    
            const responseData = await response.json();
            console.log(responseData);
            window.location.reload();
        } 
        catch (error) {
            console.error('Error archiving list:', error);
        }
    };
    
    /* Ukazani seznamu */
    const listo = () =>{
        return(
            <>
                {Listo.map((ListInfa,index) =>{

                    /* Estli jste creator seznamu tak dostanete "Admin", estli jste member tak "Member", estli jste vubec ne pridany do urciteho seznamu tak seznam se ne ukaze */
                    const isOwner = ListInfa.creator === props.username.email;
                    const isMember = ListInfa.members.some(member => member.email === props.username.email);

                    
                    if (isOwner || isMember) {
                        return(

                            <div className={ListInfa.archive ? 'ListOfListsHide' : 'ListOfLists'}style={{display:ListInfa.archive && showArchiveLists ? 'none' : 'flex'}} key={index}>
                                <div className='ListoBar'>

                                    <div  className='IconBlock'>
                                        {SwichFun(ListInfa.selectedOption)}
                                    </div>

                                    <div className='InfoBlock'>
                                        <Link to={`/list/${ListInfa._id}`} className='titleList'>{ListInfa.listname}</Link>
                                        <div className='roleList'>{ListInfa.creator === props.username.email ? 'Admin' : 'Member'}</div>
                                    </div>
                                    
                                    <div className='ButtonBlock'onClick={() => ArchiveButton(ListInfa._id, ListInfa.archive)}>

                                        <div className='ArchiveButton'>
                                            <ArchiveSVG/>
                                        </div>

                                        <div className='EditButton'>
                                            <EditButtonSVG/>
                                        </div>

                                        <div className='DeleteButton'  onClick={()=>DeleteButton(ListInfa._id)}>
                                            <DeleteButtonSVG/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );}
                        else {
                            // estli jste neni memner ani admin, seznam ne ukaze
                            return null;
                          }
                    }
                )}
            </>
            
        )
    }
    const ShowCreateListButton = () => {
        return(
            <>
                {props.isAuthenticated ? (
                    <Link className='CreateListBlock'  to = {props.create}>Create new list
                        <PlusSVG/>
                    </Link>
                ) : (
                    <Link className='CreateListBlock'  to = '/register'>Create new list
                        <PlusSVG/>
                    </Link>
                )}
            </>
        )
    }
    return(
        <div className='ListsBlock'>
                        <div className='ListTitleCreate'>
                            <div className='Title'>Lists</div>
                            {ShowCreateListButton()}     
                        </div>
            {listo()}
            <div className='ArchiveButtonShow' onClick={()=>setShowArchiveLists(!showArchiveLists)}>
                <ArchiveSVG/>
            </div>
        </div>
    )
}
export default Lists
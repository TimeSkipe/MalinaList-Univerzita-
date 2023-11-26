import React, { useState, useEffect } from 'react';
import "../style/lists.css"
import { Link } from 'react-router-dom';
import { PORT } from "../connect/connect";
import { ArchiveSVG, EditButtonSVG, DeleteButtonSVG, PlusSVG} from "../files/svg";
import { ArchiveButton, SwichFun, DeleteButton } from '../components/ListsFunComponent';
import { LoadingComponentLists } from '../components/loadingSkeletons';
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
        
    },[Listo])
    
    if(!Listo){
        return<>{<LoadingComponentLists/>}</>;
    }
    
    const Searcho = localStorage.getItem('Searcho');
    
    const filteredLists = Listo.filter((ListInfa) => {
        if (!Searcho) {
            return true;
        }
      
        const listName = ListInfa.listname || "";
        const searchLowerCase = Searcho.toLowerCase();
        return listName.toLowerCase().includes(searchLowerCase);
      });
    /* Ukazani seznamu */
    const listo = () =>{
        return(
            <>
                {filteredLists.map((ListInfa,index) =>{

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
                                    
                                    <div className={ListInfa.creator=== props.username.email ? 'ButtonBlock' : "ButtonBlockHide"}>

                                        <div className='ArchiveButton'onClick={() => ArchiveButton(ListInfa._id, ListInfa.archive)}>
                                            <ArchiveSVG/>
                                        </div>

                                        <Link className='EditButton' to={`/EditList/${ListInfa._id}`}>
                                            <EditButtonSVG/>
                                        </Link>

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
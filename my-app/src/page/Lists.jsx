import React, { useState, useEffect } from 'react';
import "../style/lists.css"
import { Link } from 'react-router-dom';
import { PORT } from "../connect/connect";
import { ArchiveSVG, EditButtonSVG, DeleteButtonSVG, PlusSVG} from "../files/svg";
import { ArchiveButton, SwichFun, DeleteButton } from '../components/ListsFunComponent';
import { LoadingComponentLists } from '../components/loadingSkeletons';
import language from '../language/language';
const Lists = (props) =>{ 

    const[Listo, setListo] = useState([]);
    const[showArchiveLists, setShowArchiveLists] = useState(true)
    /* Get request do DB na gain data list */
    const ListInfa = async () =>{
        try {
            const response = await fetch(`${PORT}/getoList`);
            const data = await response.json();
            setListo(data);
        } catch (error) {
            console.log('Error', error)
        }
    }
    useEffect(()=>{
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
        console.log(Searcho)
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

                            <div className={ListInfa.archive ? 'ListOfListsHide Hide-Color' : 'ListOfLists Second-color'}style={{display:ListInfa.archive && showArchiveLists ? 'none' : 'flex'}} key={index}>
                                <div className='ListoBar '>

                                    <div  className='IconBlock'>
                                        {SwichFun(ListInfa.selectedOption, 'SVG-main-color')}
                                    </div>

                                    <div className='InfoBlock'>
                                        <Link to={`/list/${ListInfa._id}`} className='titleList Text-Color' >{ListInfa.listname}</Link>
                                        <div className='roleList second-text-color'>{ListInfa.creator === props.username.email ? `${props.lan ? language[props.lan].Lists.Admin : language.English.Lists.Admin}` : `${props.lan ? language[props.lan].Lists.Member : language.English.Lists.Member}`}</div>
                                    </div>
                                    
                                    <div className={ListInfa.creator=== props.username.email ? 'ButtonBlock' : "ButtonBlockHide"}>

                                        <div className='ArchiveButton'onClick={() => ArchiveButton(ListInfa._id, ListInfa.archive)}>
                                            <ArchiveSVG className={'SVG-main-color'}/>
                                        </div>

                                        <Link className='EditButton' to={`/EditList/${ListInfa._id}`}>
                                            <EditButtonSVG className={'SVG-main-color'}/>
                                        </Link>

                                        <div className='DeleteButton'  onClick={()=>DeleteButton(ListInfa._id)}>
                                            <DeleteButtonSVG className={'DeleteButtonSVG'}/>
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
                    <Link className='CreateListBlock Main-Button Text-Color'  to = {props.create}>{props.lan ? language[props.lan].Lists.CreateNewList : language.English.Lists.CreateNewList}
                        <PlusSVG className={'SVG-main-color'}/>
                    </Link>
                ) : (
                    <Link className='CreateListBlock Main-Button Text-Color'  to = '/register'>{props.lan ? language[props.lan].Lists.CreateNewList : language.English.Lists.CreateNewList}
                        <PlusSVG className={'SVG-main-color'}/>
                    </Link>
                )}
            </>
        )
    }
    return(
        <div className='ListsBlock'>
                        <div className='ListTitleCreate'>
                            <div className='Title Text-Color'>{props.lan ? language[props.lan].Lists.Lists : language.English.Lists.Lists}</div>
                            {ShowCreateListButton()}     
                        </div>
            {listo()}
            <div className='ArchiveButtonShow SVG-main-color Main-Button' onClick={()=>setShowArchiveLists(!showArchiveLists)}>
                <ArchiveSVG/>
            </div>
        </div>
    )
}
export default Lists
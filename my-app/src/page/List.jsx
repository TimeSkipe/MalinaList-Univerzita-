import React, { useEffect, useState } from 'react';
import { PORT } from "../connect/connect";
import { useParams, Link, useNavigate } from 'react-router-dom';
import "../style/list.css"
import "../style/media.css";
import { BackButtonSVG, DeleteButtonSVG, EditButtonSVG } from '../files/svg';
import { DeleteItem, ResolvedChange, deleteUserFromList, leaveFromList, addMemberToList} from '../components/ListFunComponent';
import { LoadingComponentList } from '../components/loadingSkeletons';
import language from '../language/language';


const ListDetail = (props) => {
  /*id list, pouziva useParams na zisteni id listu podle linku v vyhledavacu(Chrome)*/
  const {id} = useParams();
  const navigate = useNavigate();

  const [ShowAddUser, setShowAddUser] = useState(true)
  const [ShowAddUserBlock, setShowAddUserBlock] = useState(false)
  const [ShowMemberList, setShowMemberList] = useState(false)
  
  /* Data na zmenu nazvu a description zbozi*/
  const [title, setTitle] = useState('');
  const [dec, setDec] = useState('')

  /* Button na pridani novych zbozi*/
  const [showAddTowar, setShowAddTowar] = useState(false);
  
  // useStaty na edit zbozi
  const [edittitle, setEditTitle] = useState('');
  const [editdescription, setEditDescription] = useState('');
  const [editItemStates, setEditItemStates] = useState({});
  // constanty(funkce) na zistovani ktery prave zbozi musi zmenit sve data v DataBazi bez toho abych zmenili udaje jinech zbozi 
  const toggleEditState = (itemId) => {
    setEditItemStates((prevEditStates) => ({
      ...prevEditStates,
      [itemId]: !prevEditStates[itemId],
    }));
  };

  const EditTitle = (itemId, value) => {
    setEditTitle((prevEditTitles) => ({
      ...prevEditTitles,
      [itemId]: value,
    }));
  };
  
  const EditDescription = (itemId, value) => {
    setEditDescription((prevEditDescriptions) => ({
      ...prevEditDescriptions,
      [itemId]: value,
    }));
  };


  /* Funkce na edit zbozi */
  const EditItem = async (itemId, id) => {
    const updatedItem = {
      titleitem: edittitle[itemId] || '', 
      descitem: editdescription[itemId] || '',
    };
  
    try {
      const response = await fetch(`${PORT}/updateItem/${id}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
  
      if (response.ok) {
        console.log('Item updated successfully');
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  
  /* Funkce na pridani zbozi*/
  const Submit = async (e) => {
    e.preventDefault();
  
    const newItem = {
      title: title,
      description: dec,
      resolved:false,
    };
  
    try {
      const response = await fetch(`${PORT}/addItem/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
    
      const responseData = await response.json();
      console.log(responseData);
      return (setShowAddTowar(false),setTitle(''),setDec(''))
      //window.location.reload();
    } 
    catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // constanty na ulozeni data z DataBazi do setList(informace o aktualnem seznamu), a setUser(informace o uzivatelech ktery vubec existuji v DataBazi(ne zo seznamu))
  const [list, setList] = useState(null);
  const [user, setUser] = useState('')
  // Funkce FetchData
  const fetchData = async (id) => {

    try {
      const listResponse = await fetch(`${PORT}/getList/${id}`);
      const listData = await listResponse.json();
      setList(listData);
  
      const usersResponse = await fetch(`${PORT}/users`);
      const usersData = await usersResponse.json();
      setUser(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [HideMenuMobil, setHideMenuMobil] = useState(false);
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setHideMenuMobil(true)
    } else {
      setHideMenuMobil(false)
        
    }
  }


  // volani fetchData, ktera otpovida za nacitani data userov a obsahu listu(first render), druhy a pristi rendery update data userov, a listov bez reloadu stranky 
  useEffect(() => {
    fetchData(id);
    window.addEventListener("resize", handleResize)
  }, [id, list, window.innerWidth]);
  
  // If list je prazny, volani Loading skeleton, po nacitani data listu, skeleton zmizne
  if (!list) {
    return <>{<LoadingComponentList/>}</>; 
    }

  // CallBack funkce ktera otpovida za precho na "/lists" kdy uzivatel stiskne leavefromlist
  const CallLeaveClick = () => {
    leaveFromList(props.username.email, id, () => {
      console.log('Successfully left the list. Navigating to /lists');
      navigate('/lists')
    });
  };

  /* Sortovani itemov if(resolved == true) ukazovat dolu seznamu */
  const sortedItems = list.items.sort((a, b) => (a.resolved === b.resolved ? 0 : a.resolved ? 1 : -1));

  const listMap = () =>{
    return(
      <>
        {sortedItems.map((item, index)=>(
           <>
          <div className={editItemStates[item._id] ? 'LD-ItemHide' : 'LD-Item Second-color'} key={index}>
              <input type="checkbox" defaultChecked={item.resolved} onChange={() => ResolvedChange(item._id, id)} />

              <div className='shlapa'>
                <div className='Item-Title Text-Color'>{item.titleitem}</div>
                <div className='Item-Dec second-text-color'>{item.descitem}</div>
              </div>

              <div className='LD-Buttons'>

                <div className='EditoButton' onClick={() => toggleEditState(item._id)}>
                  <EditButtonSVG className={'SVG-main-color'}/>
                </div>
                <div className='DeletoButton' onClick={() => DeleteItem(item._id, id)}>
                  <DeleteButtonSVG className={'DeleteButtonSVG'}/>
                </div>

              </div>
            </div>
            <div className={editItemStates[item._id] ? 'LD-Item Second-color' : 'LD-ItemHide Second-color'}>

              <form onSubmit={()=>EditItem(item._id, id)}>
                <input type="checkbox" defaultChecked={item.resolved} onChange={() => ResolvedChange(item._id, id)}/>
                <div className='shlapaedit '>
                  <div className='Item-Title'><input  className='Second-color Text-Color'type='text' placeholder={item.titleitem} value={edittitle[item._id] || ""} onChange={(e) => EditTitle(item._id, e.target.value)}/></div>
                  <div className='Item-Dec'><input  className='Second-color Text-Color'type='text' placeholder={item.descitem} value={editdescription[item._id] || ""}  onChange={(e) => EditDescription(item._id, e.target.value)}/></div>
                </div>
                <div className='LD-Buttons'>
                  <button className='SaveButtonEdit Third-Color Text-Color' type='submit'>{props.lan ? language[props.lan].List.Save : language.English.List.Save}</button>
                </div>
              </form>
            </div>
            </>
        ))}
      </>
            
    )
  }
  /* Seznam userov kteri se pridaji do seznamu zbozi */
  

  const userListo = () =>{
    return(
      <>
        {list.members.map((user, index)=>(
          <div className='Garazza' key={index}>
            <div className='Text-Color'>{user.namemember}</div>
            <div className='second-text-color'>{user.email}</div>
            <div className={ShowAddUser ? 'DeleteUserHide' : 'DeleteUser'} onClick={() => deleteUserFromList(user.email, id)}>
              <DeleteButtonSVG className={'DeleteButtonSVG'}/>
            </div>
          </div>
        ))}
      </>
    )
  }
  
  /* estli v seznamu jste vy(to se tyce jak vlastnika seznamu a uzivatele ktery je pridany do aktualneho seznamu), tak Vas uset nebude ukazovat */
  const AdduserListo = () => {
    // porovnani email z Object.value(user) do props.username.email
    const isCurrentUser = (email) => email === props.username.email;
    const listMemberEmails = list.members.map((member) => member.email);
  
    const filteredUsers = Object.values(user).filter(
      (userData) =>
        !isCurrentUser(userData.email) &&
        !listMemberEmails.includes(userData.email)
    );
  
    const renderUser = (userData) => (
      <div className='Garazza' key={userData._id} onClick={() => addMemberToList(userData._id, id)}>
        <div className='Text-Color'>{userData.name}</div>
        <div className='second-text-color'>{userData.email}</div>
      </div>
    );
  
    return <>{filteredUsers.map(renderUser)}</>;
  };
  return (
    <div className='ListDetailBlock'>
      <Link to='/Lists' className='ButtonBack'>
        <BackButtonSVG className={'SVG-main-color'}/>
      </Link>
      <div className='ListDetailTitle Text-Color'>{list.listname}</div>
      <div className='Text-Color Main-Button HideMobil' onClick={()=>setShowMemberList(true)}>{props.lan ? language[props.lan].List.MemberList : language.English.List.MemberList}</div>
      <div className='ListDInfa'>
        <div className='LD-ItemsList'>
          {listMap()}
          <div className={showAddTowar ? 'addtowar Second-color' : 'addtowar-hidden Second-color'}>

            <form onSubmit={Submit}>
              <div>
                <input type="text" className='Second-color Text-Color' placeholder={props.lan ? language[props.lan].List.TitleItem : language.English.List.TitleItem} value={title} onChange={(e) => setTitle(e.target.value)} required/>
                <input type="text" className='Second-color Text-Color' placeholder={props.lan ? language[props.lan].List.ItemDes : language.English.List.ItemDes} value={dec} onChange={(e) => setDec(e.target.value)} required/>
              </div>
              <button className='SaveButton Third-Color Text-Color' type='submit'>{props.lan ? language[props.lan].List.Save : language.English.List.Save}</button>
            </form>
            
          </div>
          <div className='LD-AddTowar Third-Color Text-Color' onClick={() => setShowAddTowar(!showAddTowar)}>{props.lan ? language[props.lan].List.AddNewTowar : language.English.List.AddNewTowar}</div>
        </div>

        <div className={ShowAddUser ? 'LD-MemberList Second-color' : 'LD-MemberListVis Second-color'} style={HideMenuMobil? {transform:ShowMemberList ? "translateY(0)" : "TranslateY(-100%)"} : null}>
          <div className='LD-MemeberHead '>
            <BackButtonSVG className={'SVG-main-color'} fun={()=>setShowMemberList(false)}/>
            <div className='a Text-Color'>{props.lan ? language[props.lan].List.MemberList : language.English.List.MemberList}</div>
            <div className={list.creator === props.username.email ? 'EditMember' : 'EditMemberNone'} onClick={()=>{setShowAddUser(!ShowAddUser);setShowAddUserBlock(false)}}>
              <EditButtonSVG className={'SVG-main-color'}/>
            </div>

          </div>

          <div className='Members'>
            {userListo()}
          </div>
          <div className={list.creator !== props.username.email ? "LeaveButton Text-Color Third-Color":'LeaveButtonHide'}onClick={() => CallLeaveClick(props.username.email, id)} >{props.lan ? language[props.lan].List.Leave : language.English.List.Leave}</div>
          <div className={ShowAddUserBlock ? 'MemberSearch' : "MemberSearchHide"}>
            <div className='MemberToAdd Text-Color'>{props.lan ? language[props.lan].List.MemberToAdd : language.English.List.MemberToAdd}</div>
            {AdduserListo()}
          </div>
          
          <div className='PlusMember Text-Color Third-Color' onClick={()=>{setShowAddUserBlock(!ShowAddUserBlock)}}>{props.lan ? language[props.lan].List.AddMemberBut : language.English.List.AddMemberBut}</div>
        </div>
      </div>
    </div>
  );
};
export default ListDetail;

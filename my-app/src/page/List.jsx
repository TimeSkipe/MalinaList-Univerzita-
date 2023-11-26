import React, { useEffect, useState } from 'react';
import { PORT } from "../connect/connect";
import { useParams, Link, useNavigate } from 'react-router-dom';
import "../style/list.css"
import { BackButtonSVG, DeleteButtonSVG, EditButtonSVG } from '../files/svg';
import { DeleteItem, ResolvedChange, deleteUserFromList, leaveFromList, addMemberToList} from '../components/ListFunComponent';
import { LoadingComponentList } from '../components/loadingSkeletons';


const ListDetail = (props) => {
  /*id list, pouziva useParams na zisteni id listu podle linku v vyhledavacu(Chrome)*/
  const {id} = useParams();
  const navigate = useNavigate();

  const [ShowAddUser, setShowAddUser] = useState(true)
  const [ShowAddUserBlock, setShowAddUserBlock] = useState(false)
  
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
  // volani fetchData, ktera otpovida za nacitani data userov a obsahu listu(first render), druhy a pristi rendery update data userov, a listov bez reloadu stranky 
  useEffect(() => {
    fetchData(id);
  }, [id, list]);
  
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
          <div className={editItemStates[item._id] ? 'LD-ItemHide' : 'LD-Item'} key={index}>
              <input type="checkbox" defaultChecked={item.resolved} onChange={() => ResolvedChange(item._id, id)} />

              <div className='shlapa'>
                <div className='Item-Title'>{item.titleitem}</div>
                <div className='Item-Dec'>{item.descitem}</div>
              </div>

              <div className='LD-Buttons'>

                <div className='EditoButton' onClick={() => toggleEditState(item._id)}>
                  <EditButtonSVG/>
                </div>
                <div className='DeletoButton' onClick={() => DeleteItem(item._id, id)}>
                  <DeleteButtonSVG/>
                </div>

              </div>
            </div>
            <div className={editItemStates[item._id] ? 'LD-Item' : 'LD-ItemHide'}>

              <form onSubmit={()=>EditItem(item._id, id)}>
                <input type="checkbox" defaultChecked={item.resolved} onChange={() => ResolvedChange(item._id, id)}/>
                <div className='shlapaedit'>
                  <div className='Item-Title'><input type='text' placeholder={item.titleitem} value={edittitle[item._id] || ""} onChange={(e) => EditTitle(item._id, e.target.value)}/></div>
                  <div className='Item-Dec'><input type='text' placeholder={item.descitem} value={editdescription[item._id] || ""}  onChange={(e) => EditDescription(item._id, e.target.value)}/></div>
                </div>
                <div className='LD-Buttons'>
                  <button className='SaveButtonEdit' type='submit'>Save</button>
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
            <div>{user.namemember}</div>
            <div>{user.email}</div>
            <div className={ShowAddUser ? 'DeleteUserHide' : 'DeleteUser'} onClick={() => deleteUserFromList(user.email, id)}>
              <DeleteButtonSVG/>
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
        <div>{userData.name}</div>
        <div>{userData.email}</div>
      </div>
    );
  
    return <>{filteredUsers.map(renderUser)}</>;
  };
  return (
    <div className='ListDetailBlock'>
      <Link to='/Lists' className='ButtonBack'>
        <BackButtonSVG/>
      </Link>
      <div className='ListDetailTitle'>{list.listname}</div>

      <div className='ListDInfa'>
        <div className='LD-ItemsList'>
          {listMap()}
          <div className={showAddTowar ? 'addtowar' : 'addtowar-hidden'}>

            <form onSubmit={Submit}>
              <div>
                <input type="text" placeholder='Title item' value={title} onChange={(e) => setTitle(e.target.value)} required/>
                <input type="text" placeholder='Item description' value={dec} onChange={(e) => setDec(e.target.value)} required/>
              </div>
              <button className='SaveButton' type='submit'>Save</button>
            </form>
            
          </div>
          <div className='LD-AddTowar' onClick={() => setShowAddTowar(!showAddTowar)}>Add new towar</div>
        </div>

        <div className={ShowAddUser ? 'LD-MemberList' : 'LD-MemberListVis'}>
          <div className='LD-MemeberHead'>

            <div className='a'>Member list</div>
            <div className={list.creator === props.username.email ? 'EditMember' : 'EditMemberNone'} onClick={()=>{setShowAddUser(!ShowAddUser);setShowAddUserBlock(false)}}>
              <EditButtonSVG/>
            </div>

          </div>

          <div className='Members'>
            {userListo()}
          </div>
          <div className={list.creator !== props.username.email ? "LeaveButton":'LeaveButtonHide'}onClick={() => CallLeaveClick(props.username.email, id)} >Leave from list</div>
          <div className={ShowAddUserBlock ? 'MemberSearch' : "MemberSearchHide"}>
            <div className='MemberToAdd'>Member to add</div>
            {AdduserListo()}
          </div>
          
          <div className='PlusMember' onClick={()=>{setShowAddUserBlock(!ShowAddUserBlock)}}>Add new Member</div>
        </div>
      </div>
    </div>
  );
};
export default ListDetail;

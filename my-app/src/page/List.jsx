import React, { useEffect, useState } from 'react';
import { PORT } from '../connect/connect';
import { useParams } from 'react-router-dom';
import "../style/list.css"
import { DeleteButtonSVG, EditButtonSVG } from '../files/svg';
const ListDetail = (props) => {
  /*id list */
  const {id} = useParams();

  const [list, setList] = useState(null);

  /* Data na zmenu nazvu a description zbozi*/
  const [title, setTitle] = useState('');
  const [dec, setDec] = useState('')

  /* Button na pridani novych zbozi*/
  const [showAddTowar, setShowAddTowar] = useState(false);

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
      // console.log(responseData);
      setShowAddTowar(false)
      window.location.reload();
    } 
    catch (error) {
      console.error('Error adding item:', error);
    }
  };

  /* Vymazani zbozi ze seznamu */
  const DeleteItem = async (itemId) => {

    /* Forma na stvrzeni*/
    const isConfirmed = window.confirm('Are you sure you want to remove this item from the list?');
    if (!isConfirmed) {
      return;
    }


    try {
      const response = await fetch(`${PORT}/deleteItem/${id}/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      window.location.reload();
    } 
    catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  /*  */
  const ResolvedChange = async (itemId) => {
    try {
      const response = await fetch(`${PORT}/updateResolved/${id}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response)
      window.location.reload();
    } 
    catch (error) {
      console.error('Error updating resolved:', error);
    }
  };

  const [edittitle, setEditTitle] = useState('');
  const [editdescription, setEditDescription] = useState('');
  const [editItemStates, setEditItemStates] = useState({});

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
  const EditItem = async (itemId) => {
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

  /* Seznam userov kteri se pridaji do seznamu zbozi */
  const [user, setUser] = useState('')
  const [ShowAddUser, setShowAddUser] = useState(true)
  const [ShowAddUserBlock, setShowAddUserBlock] = useState(false)

  const userListo = () =>{
    return(
      <>
        {list.members.map((user, index)=>(
          <div className='Garazza' key={index}>
            <div>{user.namemember}</div>
            <div>{user.email}</div>
            <div className={ShowAddUser ? 'DeleteUserHide' : 'DeleteUser'} onClick={() => deleteUserFromList(user.email)}>
              <svg width="30" height="30" viewBox="0 0 30 30"  xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 18.75C7.5 18.2527 7.69754 17.7758 8.04918 17.4242C8.40081 17.0725 8.87772 16.875 9.375 16.875C9.87228 16.875 10.3492 17.0725 10.7008 17.4242C11.0525 17.7758 11.25 18.2527 11.25 18.75V22.5C11.25 22.9973 11.0525 23.4742 10.7008 23.8258C10.3492 24.1775 9.87228 24.375 9.375 24.375C8.87772 24.375 8.40081 24.1775 8.04918 23.8258C7.69754 23.4742 7.5 22.9973 7.5 22.5V18.75ZM13.125 18.75C13.125 18.2527 13.3225 17.7758 13.6742 17.4242C14.0258 17.0725 14.5027 16.875 15 16.875C15.4973 16.875 15.9742 17.0725 16.3258 17.4242C16.6775 17.7758 16.875 18.2527 16.875 18.75V22.5C16.875 22.9973 16.6775 23.4742 16.3258 23.8258C15.9742 24.1775 15.4973 24.375 15 24.375C14.5027 24.375 14.0258 24.1775 13.6742 23.8258C13.3225 23.4742 13.125 22.9973 13.125 22.5V18.75ZM18.75 18.75C18.75 18.2527 18.9475 17.7758 19.2992 17.4242C19.6508 17.0725 20.1277 16.875 20.625 16.875C21.1223 16.875 21.5992 17.0725 21.9508 17.4242C22.3025 17.7758 22.5 18.2527 22.5 18.75V22.5C22.5 22.9973 22.3025 23.4742 21.9508 23.8258C21.5992 24.1775 21.1223 24.375 20.625 24.375C20.1277 24.375 19.6508 24.1775 19.2992 23.8258C18.9475 23.4742 18.75 22.9973 18.75 22.5V18.75Z" />
                <path d="M10.7944 2.00813C10.9 2.07139 10.9922 2.15485 11.0656 2.25374C11.1389 2.35262 11.1921 2.465 11.2221 2.58444C11.252 2.70389 11.2582 2.82806 11.2401 2.94988C11.2221 3.07169 11.1802 3.18875 11.1169 3.29438L6.34312 11.25H23.6569L18.8812 3.29438C18.7534 3.08104 18.7156 2.82568 18.7761 2.58446C18.8366 2.34324 18.9904 2.13593 19.2037 2.00813C19.4171 1.88033 19.6724 1.84251 19.9137 1.90299C20.1549 1.96347 20.3622 2.11729 20.49 2.33063L25.8431 11.25H29.0625C29.3111 11.25 29.5496 11.3488 29.7254 11.5246C29.9012 11.7004 30 11.9389 30 12.1875V14.0625C30 14.3111 29.9012 14.5496 29.7254 14.7254C29.5496 14.9012 29.3111 15 29.0625 15H27.8944L24.4369 27.105C24.3529 27.3991 24.1752 27.6578 23.9309 27.8419C23.6867 28.026 23.389 28.1253 23.0831 28.125H6.91875C6.61287 28.1253 6.31522 28.026 6.07093 27.8419C5.82663 27.6578 5.64901 27.3991 5.565 27.105L2.10563 15H0.9375C0.68886 15 0.450403 14.9012 0.274587 14.7254C0.0987721 14.5496 0 14.3111 0 14.0625V12.1875C0 11.9389 0.0987721 11.7004 0.274587 11.5246C0.450403 11.3488 0.68886 11.25 0.9375 11.25H4.15688L9.50625 2.33063C9.56952 2.22498 9.65297 2.13283 9.75186 2.05944C9.85075 1.98605 9.96312 1.93287 10.0826 1.90292C10.202 1.87297 10.3262 1.86685 10.448 1.8849C10.5698 1.90295 10.6887 1.94482 10.7944 2.00813ZM4.05562 15L7.26938 26.25H22.7306L25.9444 15H4.05562Z"/>
              </svg>

            </div>
          </div>
        ))}
      
        
      </>
    )
  }
  const deleteUserFromList = async (email) => {
    /* Forma na stvrzeni */
    const isConfirmed = window.confirm('Are you sure you want to remove this user from the list?');
    if (!isConfirmed) {
      return;
    }


    try {
      const response = await fetch(`${PORT}/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: id, 
          email:email,
        }),
      });
      window.location.reload();

      if (response.ok) {
        console.log('User deleted successfully from the list');
      } 
      else {
        console.error('Failed to delete user from the list');
      }
    } 
    catch (error) {
      console.error('Error deleting user from the list:', error);
    }
  };

  /* estli v seznamu jste vy, tak Vas uset nebude ukazovat */
  const AdduserListo = () =>{
    return(
      <>
        {Object.keys(user).map((key, index) => (
          
        user[key].email !== props.username.email ? (
          <div className='Garazza' key={index} onClick={() => addMemberToList(user[key]._id)}>
            <div>{user[key].name}</div>
            <div>{user[key].email}</div>
          </div>
        ) : null
      ))}
      
        
      </>
    )
  }

  /* Pridani memberov do listu */
  const addMemberToList = async (userId) => {
    try {
      const response = await fetch(`${PORT}/addMemberToList/${id}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('User added to the list successfully');
      } else {
        console.error('Failed to add user to the list');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error adding user to the list:', error);
    }
  };
  

  useEffect(() => {
    /* Ukazani data listu podle id */
    const listInfa = async () => {
      try {
        const response = await fetch(`${PORT}/getList/${id}`);
        const data = await response.json();
        setList(data);
      } catch (error) {
        console.error('Error fetching list details:', error);
      }
    };
    
    /* Ukazani vsychnych userov v seznamu na pridani memberov */
    listInfa();
    const getUsers = async () => {
      try {
        const response = await fetch(`${PORT}/users`); // Замініть це на URL вашого сервера
        const users = await response.json();
    
        setUser(users)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    getUsers();
  }, [id]);


  /* Loading ...*/
  if (!list) {
    return <div style={{color:'white', fontSize:'32px', textAlign:'center'}}>Loading...</div>; 
    }

  /* Sortovani itemov if(resolved == true) ukazovat dolu seznamu */
  const sortedItems = list.items.sort((a, b) => (a.resolved === b.resolved ? 0 : a.resolved ? 1 : -1));


  const listMap = () =>{
    return(
      <>
        {sortedItems.map((item, index)=>(
           <>
          <div className={editItemStates[item._id] ? 'LD-ItemHide' : 'LD-Item'} key={index}>
              <input type="checkbox" defaultChecked={item.resolved} onChange={() => ResolvedChange(item._id)}/>

              <div className='shlapa'>
                <div className='Item-Title'>{item.titleitem}</div>
                <div className='Item-Dec'>{item.descitem}</div>
              </div>

              <div className='LD-Buttons'>

                <div className='EditoButton' onClick={() => toggleEditState(item._id)}>
                  <EditButtonSVG/>
                </div>
                <div className='DeletoButton' onClick={() => DeleteItem(item._id)}>
                  <DeleteButtonSVG/>
                </div>

              </div>
            </div>
            <div className={editItemStates[item._id] ? 'LD-Item' : 'LD-ItemHide'}>

              <form onSubmit={()=>EditItem(item._id)}>
                <input type="checkbox" defaultChecked={item.resolved} onChange={() => ResolvedChange(item._id)}/>
                <div className='shlapaedit'>
                  <div className='Item-Title'><input type='text' placeholder={item.titleitem} value={edittitle[item._id] || ''} onChange={(e) => EditTitle(item._id, e.target.value)}/></div>
                  <div className='Item-Dec'><input type='text' placeholder={item.descitem} value={editdescription[item._id] || ''}  onChange={(e) => EditDescription(item._id, e.target.value)}/></div>
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
  
  return (
    <div className='ListDetailBlock'>
      <div className='ListDetailTitle'>{list.listname}</div>

      <div className='ListDInfa'>
        <div className='LD-ItemsList'>
          {listMap()}
          <div className={showAddTowar ? 'addtowar' : 'addtowar-hidden'}>

            <form onSubmit={Submit}>
              <div>
                <input type="text" placeholder='Title item' value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder='Item description' value={dec} onChange={(e) => setDec(e.target.value)}/>
              </div>
              <button className='SaveButton' type='submit'>Save</button>
            </form>
            
          </div>
          <div className='LD-AddTowar' onClick={() => setShowAddTowar(!showAddTowar)}>Add new towar</div>
        </div>

        <div className={ShowAddUser ? 'LD-MemberList' : 'LD-MemberListVis'}>
          <div className='LD-MemeberHead'>

            <div className='a'>Member list</div>
            <div className={list.creator == props.username.email ? 'EditMember' : 'EditMemberNone'} onClick={()=>{setShowAddUser(!ShowAddUser);setShowAddUserBlock(false)}}>
              <EditButtonSVG/>
            </div>

          </div>

          <div className='Members'>
            {userListo()}
          </div>

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
import { PORT } from "../connect/connect";




  /* Vymazani zbozi ze seznamu */
 export const DeleteItem = async (itemId, id) => {

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
      //window.location.reload();
    } 
    catch (error) {
      console.error('Error deleting item:', error);
    }
  };

   /* Zmena stavu z nevureseno na vyreseno a naopak */
export const ResolvedChange = async (itemId, id) => {
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


export const deleteUserFromList = async (email,id) => {
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
      //window.location.reload();

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


export const leaveFromList = async (email, id, onSuccess) => {
    
    /* Forma na stvrzeni */
    const isConfirmed = window.confirm('Are you sure for leaving from the list?');
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
      //window.location.reload();
      
      if (response.ok) {
        console.log('User deleted successfully from the list');
        onSuccess();
      } 
      else {
        console.error('Failed to delete user from the list');
      }
    } 
    catch (error) {
      console.error('Error deleting user from the list:', error);
    }
  };


/* Pridani memberov do listu */
export const addMemberToList = async (userId, id) => {
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
    //window.location.reload();
  } catch (error) {
    console.error('Error adding user to the list:', error);
  }
};
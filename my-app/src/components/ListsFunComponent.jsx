import { PORT } from "../connect/connect";
import { People, Card, Calender,Pin, DefaultSVG } from "../files/svg";



/* Button na archivovani seznamu */
export const ArchiveButton = async (id, ArchiveStatus) => {
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

/* Button na vymazeni seznamu */
 export const DeleteButton = async (id)=>{

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


/* Funkce na ukazovani urciteho icon podle selected z databazi */
export const SwichFun = (selected, classo) =>{
    switch (selected) {
        case "people":
            return <People className={`${classo}`}/>
        case "Card":
            return <Card className={`${classo}`}/>
        case "Calender":
            return <Calender className={`${classo}`}/>
        case "Pin":
            return <Pin className={`${classo}`}/>
        default:
            return<DefaultSVG className={`${classo}`}/>
            break;
    }
}
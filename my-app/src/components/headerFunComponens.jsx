//Zmena jazyka
import { PORT } from "../connect/connect";
import { CzechImg, EnglishImg, UkrainianImg } from "../files/photos";
import { BoringGrey, PurpleHei, SkyBlue, SpaceDark, WhiteGolden } from "../files/svg";
export const ChangeLan = async (userId, lan) =>{
    try {
        const response = await fetch(`${PORT}/changeLanguage/${userId}/${lan}`,{
            method:"PUT",
            headers:{
                'Content-Type':"application/json",
            }
        });
        console.log(response)
        window.location.reload();
    } 
    catch (error) {
        console.error('Error to change language')
    }
}

export const LanVisual = (lan) =>{
    switch (lan) {
        case "English":
            return<EnglishImg/>
        case "Ukrainian":
            return<UkrainianImg/>
        case "Czech":
            return<CzechImg/>
        default:
            return<EnglishImg/>
            
    }
}

export const ChangeThem = async (userId, thema) =>{
    try {
        const response = await fetch(`${PORT}/changeThema/${userId}/${thema}`,{
            method:"PUT",
            headers:{
                'Content-Type':"application/json",
            }
        });
        console.log(response)
        window.location.reload();
    } 
    catch (error) {
        console.error('Error to change language')
    }
}

export const ThemVisual = (them) =>{
    switch (them) {
        case "Dark":
            return<SpaceDark/>
        case "SkyBlue":
            return<SkyBlue/>
        case "PurpleHei":
            return<PurpleHei/>
        case "WhiteGolden":
            return<WhiteGolden/>
        case "BoringGrey":
            return<BoringGrey/>
        default:
            return<SpaceDark/>
            
    }
}
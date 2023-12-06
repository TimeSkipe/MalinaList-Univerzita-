import React, { useState, useEffect } from "react";
import "../style/header.css"
import "../style/index.css"
import { Link, useLocation } from "react-router-dom";
import { BackButtonSVG, BoringGrey, Burger, ButtonToHideMenu, ExitButtonSVG,  PurpleHei,  SearchClearSVG, SearchSVG, SkyBlue, SpaceDark, WhiteGolden } from "../files/svg";
import { PORT } from "../connect/connect";
import { CzechImg, EnglishImg, UkrainianImg } from "../files/photos";
import language from "../language/language";
import { ChangeLan, ChangeThem, LanVisual, ThemVisual } from "./headerFunComponens";


const Header = (props) =>{
    const[searchShow, setSearchShow] = useState(true);
    const location = useLocation();
    const[SearchList, setSearchList] = useState('')
    const handleLogout = () => {
        props.setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      };
    
    //Search Funkce
    const Searcho = localStorage.getItem('Searcho');
    if(SearchList === '' && Searcho){
        localStorage.removeItem('Searcho');
    }
    
    const Search = (SearchList) =>{
        localStorage.setItem('Searcho', SearchList);
    }
    const handleEnterPress = (e) => {
      if (e.key === 'Enter') {
        Search(SearchList);
      }
    };
    const SearchDeactive = () =>{
        setSearchList('');
        localStorage.removeItem('Searcho');
    }

    /* If user is Authenticated show header with user information*/
    const [HideMenu, setHideMenu] = useState(false);
    const [HideMenuMobil, setHideMenuMobil] = useState(false);
    const [HideLanMenu, setHideLanMenu] = useState(false);
    const [HeaderHeight, setHeaderHeight] = useState(false);
    const [HideThema, setHideThema] = useState(false);
    const [SearchBG, setSearchBG] = useState(false);
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setHideMenu(true)
            setSearchBG(true)
        } else {
            setHideMenu(false)
            setSearchBG(false)
        }
      }

      useEffect(() => {
        const currentPath = location.pathname;
        
        if (currentPath.startsWith('/list/') || currentPath.startsWith('/register')||currentPath.startsWith('/login')||currentPath.startsWith('/CreateList')||currentPath.startsWith('/EditList')) {
        setSearchShow(false);
            if(window.innerWidth <= 768){
                setHeaderHeight(true);
            }
        }
        else {setSearchShow(true); setHeaderHeight(false)}

        window.addEventListener("resize", handleResize)
    }, [location.pathname, window.innerWidth]);


    const renderButton = () =>{
        if(props.isAuthenticated){
            return(
                <div className='UserBlock Main-color' style={SearchBG ? {transform:`${HideMenuMobil  ? "translateY(0%)" : "translateY(-100%)"}`} :null}>
                    
                    <div className="UserBarAuthen">
                        
                        <div className="UserInfo Text-Color Main-color">
                            <div > 
                                <BackButtonSVG className="SVG-main-color"   fun={()=>{setHideMenuMobil(false);setHideLanMenu(false);setHideThema(false)}}/>
                            </div>
                            <div>{props.username.name}</div>
                            <div>{props.username.email}</div>
                        </div>
                        <div className="HideMenu Text-Color ">
                            <div className="ButtonToHideMenu" onClick={()=>{setHideMenu(!HideMenu);setHideLanMenu(false);setHideThema(false)}}>
                                <ButtonToHideMenu  styl={{transform:`rotate(${HideMenu?"180deg" :"0deg"})`, transition:'.2s ease-in-out'}} className={'SVG-main-color'}/>
                            </div>
                            <div className="HideMenuBar Main-color" style={{display:HideMenu ? "block" : "none"}}>
                                <div className="ActualLan Main-Button" onClick={()=>setHideLanMenu(!HideLanMenu)}>
                                {LanVisual(props.lan)}{props.lan ? language[props.lan].header.Language : language.English.header.Language}
                                    <ButtonToHideMenu styl={{transform:`rotate(${HideLanMenu?"180deg" :"0deg"})`, transition:'.2s ease-in-out'}} className={"SVG-main-color"}/>
                                </div>
                                <div className="HideLanBar" style={{display:HideLanMenu ? "block" : 'none'}}>
                                    <div className="Main-Button" onClick={() => ChangeLan(props.username._id, "English")}><EnglishImg/>{props.lan ? language[props.lan].header.EnglishLan : language.English.header.EnglishLan}</div>
                                    <div className="Main-Button" onClick={() => ChangeLan(props.username._id, "Ukrainian")}><UkrainianImg/>{props.lan ? language[props.lan].header.UkrainianLan : language.English.header.UkrainianLan}</div>
                                    <div className="Main-Button" onClick={() => ChangeLan(props.username._id, "Czech")}><CzechImg/>{props.lan ? language[props.lan].header.CzechLan : language.English.header.CzechLan}</div>
                                </div>
                                <div className="ActualLan Main-Button" onClick={()=>setHideThema(!HideThema)}>
                                {ThemVisual(props.thema)}{props.lan ? language[props.lan].header.thema : language.English.header.thema}
                                    <ButtonToHideMenu styl={{transform:`rotate(${HideThema?"180deg" :"0deg"})`, transition:'.2s ease-in-out'}} className={"SVG-main-color"}/>
                                </div>
                                <div className="HideLanBar" style={{display:HideThema ? "block" : 'none'}}>
                                    <div className="Main-Button" onClick={()=>ChangeThem(props.username._id, 'Dark')}><SpaceDark/> Space-Dark</div>
                                    <div className="Main-Button" onClick={()=>ChangeThem(props.username._id, 'SkyBlue')}><SkyBlue/> SkyBlue</div>
                                    <div className="Main-Button" onClick={()=>ChangeThem(props.username._id, 'PurpleHei')}><PurpleHei/> PurpleHei</div>
                                    <div className="Main-Button" onClick={()=>ChangeThem(props.username._id, 'WhiteGolden')}><WhiteGolden/> White-Golden</div>
                                    <div className="Main-Button" onClick={()=>ChangeThem(props.username._id, 'BoringGrey')}><BoringGrey/> Boring-Grey</div>
                                </div>
                                <div className="exitButton Main-Button" onClick={handleLogout}>
                                    <ExitButtonSVG className={'SVG-main-color'}/> {props.lan ? language[props.lan].header.LogOut : language.English.header.LogOut}
                                </div>
                            </div>
                        </div>
                        

                    </div>
                </div>
            )
        }else return(
            <div className='UserBlock'>
                <div className='UserBarLogin ButtonLogin-Color Text-Color'><Link className="UserBarLogin ButtonLogin-Color Text-Color" to={props.register}>{props.lan ? language[props.lan].header.Register : language.English.header.Register}</Link></div>
                <div className='UserBarLogin ButtonLogin-Color Text-Color'><Link className="UserBarLogin ButtonLogin-Color Text-Color" to={props.login}>{props.lan ? language[props.lan].header.Login : language.English.header.Login}</Link></div>
            </div>
        )
    }
    return(
        <div className='headerBar Main-color' style={{height:HeaderHeight ? "60px" : null}}>

            <Link className='Logo' to={`/Lists`}>
                <img src="https://cdn0.iconfinder.com/data/icons/flat-round-system/512/raspberry-512.png"/>
            </Link>

            <div className={!SearchBG ? `SearchBlock` : `SearchBlock Search-Color`} style={{display: searchShow ? "flex" : "none"}}>
                <div className={!SearchBG ? `SearchBar Second-color` : `SearchBar Search-Color`}>
                    <SearchSVG fun = {Search} className={'Icon-Color'}/>
                    <input type="text" placeholder={props.lan ? language[props.lan].header.Search : language.English.header.Search} onChange={(e) => setSearchList(e.target.value)} value={SearchList} onKeyDown={handleEnterPress} className={!SearchBG ? `Second-color Text-Color` : ` Text-Color Search-Color`}/>
                    {SearchList !== '' ? <SearchClearSVG fun = {SearchDeactive} className={'Icon-Color'}/> : null}
                </div>
            </div>

            <div className='line Line-Color'></div>
                <div className="SVG-main-color Burger">
                    <Burger fun={()=>setHideMenuMobil(true)}/>
                </div>
                {renderButton()}
        </div>
    )
}
export default Header;
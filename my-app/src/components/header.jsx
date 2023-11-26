import React, { useState, useEffect } from "react";
import "../style/header.css"
import { Link, useLocation } from "react-router-dom";
import { DarkModeSVG, ExitButtonSVG, LightModeSVG, SearchClearSVG, SearchSVG } from "../files/svg";


const Header = (props) =>{
    const[searchShow, setSearchShow] = useState(true);
    const location = useLocation();
    const[SearchList, setSearchList] = useState('')
    useEffect(() => {
        const currentPath = location.pathname;
        
        if (currentPath.startsWith('/list/') || currentPath.startsWith('/register')||currentPath.startsWith('/login')||currentPath.startsWith('/CreateList')) {
        setSearchShow(false);
        }
        else setSearchShow(true)
    }, [location.pathname]);
    
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
    
    const renderButton = () =>{
        if(props.isAuthenticated){
            return(
                <div className='UserBlock'>
                    <div className="UserBarAuthen">

                        <div className="UserInfo">
                            <div>{props.username.name}</div>
                            <div style={{fontSize:'12px'}}>{props.username.email}</div>
                        </div>

                        <div className="exitButton" onClick={handleLogout}>
                            <ExitButtonSVG/>
                        </div>

                    </div>
                </div>
            )
        }else return(
            <div className='UserBlock'>
                <div className='UserBarLogin'><Link className="UserBarLogin" to={props.register}>Register</Link></div>
                <div className='UserBarLogin'><Link className="UserBarLogin" to={props.login}>Login</Link></div>
            </div>
        )
    }
    return(
        <div className='headerBar'>

            <Link className='Logo' to={`/*`}>
                <img src="https://cdn0.iconfinder.com/data/icons/flat-round-system/512/raspberry-512.png"/>
            </Link>

            <div className='SearchBlock' style={{display: searchShow ? "flex" : "none"}}>
                <div className='SearchBar'>
                    <SearchSVG fun = {Search}/>
                    <input type="text" placeholder='Please write your list`s name and click an Enter' onChange={(e) => setSearchList(e.target.value)} value={SearchList} onKeyDown={handleEnterPress}/>
                    {SearchList !== '' ? <SearchClearSVG fun = {SearchDeactive}/> : null}
                </div>
            </div>

            <div className='ThemeBlock'>
                <div className='Theme'>
                    <div className='Light'>
                        <LightModeSVG/>
                    </div>
                    <div className='Dark'>
                        <DarkModeSVG/>
                    </div>
                </div>
            </div>

            <div className='line'></div>
                {renderButton()}
        </div>
    )
}
export default Header;

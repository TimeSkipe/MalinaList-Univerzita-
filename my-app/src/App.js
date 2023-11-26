import React, { useEffect, useState } from 'react';
import Header from "./components/header.jsx";
import Lists from "./page/Lists.jsx";
import { Routes, Route } from 'react-router-dom';
import "../src/style/index.css"
import Register from "./page/registration.jsx";
import Login from "./page/Login.jsx";
import CreateList from './page/ListCreate.jsx';
import List from './page/List.jsx';
import EditList from './page/EditList.jsx';
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  
  /* Log out funkce */
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  };


  useEffect(() => {
    /*Kontrola ci je user Auterizovany */
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const user = JSON.parse(localStorage.getItem('user'));

    if (isAuthenticated) {
      setIsAuthenticated(true);
      setUsername(user);
      
    };
  }, []);
  
  return (
    <div className="App">
      <Header
        register="/register"
        account="/account"
        login="/login"
        isAuthenticated={isAuthenticated}
        username={username}
        setIsAuthenticated={setIsAuthenticated}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route
          path="/register"
          element={<Register setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
        ></Route>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
        ></Route>
        <Route path='/Lists' element={<Lists create = '/CreateList' username={username} isAuthenticated={isAuthenticated}/>}></Route>
        <Route path='/list/:id' element={<List username={username}></List>}></Route>
        <Route path='/CreateList' element={<CreateList username = {username}/>}></Route>
        <Route path='/EditList/:id' element={<EditList/>}></Route>
        <Route path='/*' element={<Lists create = '/CreateList' username={username}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;

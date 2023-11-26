import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PORT } from '../connect/connect';
import axios from 'axios';
import "../style/register.css"
const Login = ({setIsAuthenticated,setUsername}) =>{

    const navigate = useNavigate();

    /*Data na usera */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /* Forma autorizace */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const authResponse = await axios.post(`${PORT}/login`, {
            email,
            password,
          });
          /* ulozeni do localStorage status isAuthenticated a data na usera, abych po prechodu na /Lists a restartovani data user ne zmizli */
          localStorage.setItem('isAuthenticated', true);
          localStorage.setItem('user', JSON.stringify(authResponse.data.user));
          setIsAuthenticated(true);
          setUsername(authResponse.data.user); // або інше поле, яке містить ім'я користувача
          navigate('/Lists');
        } 
        catch (error) {
          console.error('Login error', error);
        }
      };
      
    return(
        <div className="Reg">
            <div className="RegisterBlock">
                <div className="TitlePage">Login</div>
                <div className="RegisterForm">
                    <form onSubmit={handleLoginSubmit}>
                        <input type="email" placeholder="Email"value={email}onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="password"value={password}onChange={(e) => setPassword(e.target.value)}/>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Login;
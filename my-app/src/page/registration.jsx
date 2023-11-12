import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PORT } from '../connect/connect';
import axios from 'axios';
import "../style/register.css"
const Register = ({setIsAuthenticated,setUsername}) =>{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
    
        if (
          name.trim() === '' ||
          email.trim() === '' ||
          password.trim() === ''
        ) {
          alert('Please fill in all fields');
          return;
        }
    
        try {
          const response = await axios.post(`${PORT}/register`, {name,email,password,thema:'Dark'});
    
          console.log(response.data);
    
          setName('');
          setEmail('');
          setPassword('');
    
          const authResponse = await axios.post(`${PORT}/login`, {
            email,
            password,
          });
    
          console.log(authResponse.data);
          localStorage.setItem('isAuthenticated', true);
          localStorage.setItem('user', JSON.stringify(authResponse.data.user));
          setIsAuthenticated(true);
          setUsername(authResponse.data.user.name); // або інше поле, яке містить ім'я користувача
          navigate('/Lists');
          window.location.reload()
        } catch (error) {
          console.error('Registration error', error);
          
        }
      };
    return(
        <div className="Reg">
            <div className="RegisterBlock">
                <div className="TitlePage">Register</div>
                <div className="RegisterForm">
                    <form onSubmit={handleRegistrationSubmit}>
                        <input type="text"  placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                        <input type="email" placeholder="Email"value={email}onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="password"value={password}onChange={(e) => setPassword(e.target.value)}/>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Register;
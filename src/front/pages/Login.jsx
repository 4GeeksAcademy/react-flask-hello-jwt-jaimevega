import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
  

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${backendUrl}api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        })
        .then(response => {
            console.log('esta es la respuesta');
            return response.json();
        })
        .then(data =>{
            console.log('se guarda el token y redireccion');
            
            sessionStorage.setItem('access_token',data.access_token)
            navigate('/users')
        })
        .catch(error => console.error("Error:", error));
    };

    useEffect(()=>{
        const token = sessionStorage.getItem('access_token')
        if (token){
            navigate('/users')
        }

    },[])

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h2>Bienvenido</h2>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="correo@ejemplo.com"
                            onChange={handleChange}
                            value={credentials.email}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            value={credentials.password}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Iniciar Sesión
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes cuenta? <span className="auth-link" onClick={() => navigate("/register")}>Regístrate</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registro.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        console.log(e);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${backendUrl}api/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) alert("¡Error al registrar el usuario");
                return response.json();
            })
            .then(data => {
                alert("¡Registro exitoso! Ahora puedes loguearte.");
                navigate("/login");
            })
            .catch(error => console.error("Error:", error));
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="mb-4">Crear Cuenta</h2>

                <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="ejemplo@correo.com"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Min. 6 caracteres"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Registrarse
                </button>

                <p className="mt-3 text-center">
                    ¿Ya tienes cuenta? <span className="link" onClick={() => navigate("/login")}>Inicia sesión</span>
                </p>
            </form>
        </div>
    );
};

export default Register;
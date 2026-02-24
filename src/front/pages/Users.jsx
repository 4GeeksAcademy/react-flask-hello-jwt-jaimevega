import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/users.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();
    const getUserList = () => {
        const token = sessionStorage.getItem('access_token');

        fetch(`${backendUrl}api/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setUserList(data.users || []))
        .catch(error => console.log("Error:", error));
    };

    const deleteUserById = (userId) => {
        fetch(`${backendUrl}api/user/${userId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) getUserList(); 
        })
        .catch(error => console.log(error));
    };

    const updateActiveUserById = (userId, isActive) => {
        fetch(`${backendUrl}api/user/${userId}`, {
            method: "PUT",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ is_active: !isActive })
        })
        .then(response => {
            if (response.ok) getUserList();
        })
        .catch(error => console.log(error));
    };

    const handleLogout = () => {
        sessionStorage.removeItem("access_token");
        navigate("/login");
    };

    useEffect(() => {
        getUserList();
    }, []);

    return (
        <div className="users-container">
            <div className="users-card">
                <div className="users-card-container" >
                    <h2 className="users-title">Lista de Usuarios</h2>
                     <button 
                        className="btn-logOut" 
                        onClick={handleLogout}
                        title="Cerrar Sesion"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            className="icon icon-tabler icons-tabler-outline icon-tabler-logout-2"
                        
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M10 8V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" />
                            <path d="M15 12H3l3-3M6 15l-3-3" />
                        </svg>
                    </button>
                </div>
                
                <div className="users-list">
                    {userList.map((user) => (
                        <div key={user.id} className="user-item">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                                alt="avatar" 
                                className="user-avatar" 
                            />
                            <div className="user-info">
                                <h6 className="user-email">{user.email}</h6>
                                <p className="user-status">ID: {user.id} • {user.is_active ? 'Activo' : 'Inactivo'}</p>
                            </div>
                            <div className="user-actions">
                                <button 
                                    className={`btn-toggle ${user.is_active ? 'active' : ''}`}
                                    onClick={() => updateActiveUserById(user.id, user.is_active)}
                                    title="Cambiar estado"
                                >
                                    {user.is_active ? <i className="fa-solid fa-toggle-on text-success"></i> : <i className="fa-solid fa-toggle-off"></i>}
                                </button>
                                <button 
                                    className="btn-delete" 
                                    onClick={() => deleteUserById(user.id)}
                                    title="Eliminar"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
           
        </div>
    );
};

export default Users;
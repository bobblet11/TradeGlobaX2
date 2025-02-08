import React, { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/userAuthController";

const AUTH_CONTEXT = createContext();

export const useAuth = () => {
    return useContext(AUTH_CONTEXT);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");

    const login = async (credentials) => {
        const loginResult = await loginUser(credentials);
        
        if (!loginResult){
            alert("Failed to login!");
            throw new Error("bad response from server");
        }

        const {user, token} = loginResult;
        setUser(user);
        setToken(token);
        localStorage.setItem("site", token);
        return true;
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        return true;
    };

    const register = async (credentials) => {
        const registerResult = await registerUser(credentials);
        
        if (!registerResult){
            alert("Failed to register!");
            throw new Error("bad response from server");
        }
        //do a response.ok in regiterUser and loginUser to send error so that user can see why. i.e account already exists

        alert("successful registration");
        return true;
    };

    return (
        <AUTH_CONTEXT.Provider value={{ user, token, login, logout, register }}> {/* Include user in the context value */}
            {children}
        </AUTH_CONTEXT.Provider>
    );
};
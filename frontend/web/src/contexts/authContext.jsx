import React, { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/userAuthController";

const AUTH_CONTEXT = createContext();

export const useAuth = () => {
    return useContext(AUTH_CONTEXT);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        const user = await loginUser(credentials);
        setUser(user);
        return user;
    };

    const register = async (credentials) => {
        const user = await registerUser(credentials);
        setUser(user);
        return user;
    };

    return (
        <AUTH_CONTEXT.Provider value={{ user, login, register }}> {/* Include user in the context value */}
            {children}
        </AUTH_CONTEXT.Provider>
    );
};
"use client";
import React, { createContext, useEffect, useState, useContext, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const GlobalContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const GlobalContextProvider = ({ children }) => {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auth0User, setAuth0User] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/v1/check-auth");
                console.log(response.data);

                setIsAuthenticated(res.data.isAuthenticated);
                setAuth0User(res.data.user);
                setLoading(false);
            } catch (error) {
                console.log("Error checking authentication status:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

    }, []);

    const getUserProfile = async (id) => {
        try {
            const response = await axios.get(`/api/v1/user/${id}`);
            setUserProfile(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };
    useEffect(() => {
        if (isAuthenticated && auth0User) {
            getUserProfile(auth0User.sub);
        }
    }, [isAuthenticated, auth0User]);

    return (
        <GlobalContext.Provider value={{ isAuthenticated, userProfile, auth0User, loading, getUserProfile }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
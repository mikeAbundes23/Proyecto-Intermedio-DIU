import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import swalMessages from '../services/SwalMessages';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [progressData, setProgressData] = useState({
        habits: [],
        completedPercentage: 0,
        currentStreak: 0,
        longestStreak: 0,
        filteredHabits: []
    });

    const fetchProgressData = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const [userResponse, habitsResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/user/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/habits/`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            setProgressData({
                habits: habitsResponse.data.data || [],
                filteredHabits: habitsResponse.data.data || [],
                completedPercentage: userResponse.data.habits_completed || 0,
                currentStreak: userResponse.data.data?.ongoing_streak || 0,
                longestStreak: userResponse.data.data?.longest_streak || 0
            });
        } catch (error) {
            console.error("Error en fetchProgressData: ", error);
            swalMessages.errorMessage(error.response?.data?.message);
        }
    };

    return (
        <ProgressContext.Provider value={{ progressData, setProgressData, fetchProgressData }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);
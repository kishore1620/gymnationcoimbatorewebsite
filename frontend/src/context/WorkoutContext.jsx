// context/WorkoutContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState({});

  // Fetch workouts from backend
  const fetchWorkouts = async () => {
    if (!user?._id) return;
    try {
     const res = await fetch(`http://localhost:5000/api/workouts/myworkouts/${user._id}`);
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts, fetchWorkouts }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => useContext(WorkoutContext);

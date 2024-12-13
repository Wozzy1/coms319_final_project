import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import TrainingPlans from "./TrainingPlans";
import Landing from "./Landing";
import CustomerFeedback from "./CustomerFeedback";
import ScheduleAppt from "./ScheduleAppt";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage if available
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          userID: 0,
          username: "",
          password: "",
          isAdmin: false,
          isLoggedIn: false,
        };
  });

  useEffect(() => {
    // Save user state to localStorage on change
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <div className='App'>
      <Router>
        <div className='container-fluid' style={{ padding: "1rem" }}>
          <Navbar user={user} setUser={setUser} />
        </div>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/training_plans' element={<TrainingPlans />} />
          <Route
            path='/appointments'
            element={<ScheduleAppt user={user} setUser={setUser} />}
          />
          <Route
            path='/feedback'
            element={<CustomerFeedback user={user} setUser={setUser} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

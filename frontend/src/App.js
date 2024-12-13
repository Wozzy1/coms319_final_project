import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import Navbar from "./Navbar";
import TrainingPlans from "./TrainingPlans";
import Landing from "./Landing";
import CustomerFeedback from "./CustomerFeedback";
import ScheduleAppt from "./ScheduleAppt";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userID, setUserID] = useState(0);

  return (
    <div className='App'>
      <Router>
        <div className='container-fluid' style={{ padding: "1.7rem" }}>
          <Navbar
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            userID={userID}
            setUserID={setUserID}
          />
        </div>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/training_plans' element={<TrainingPlans />} />
          <Route path='/appointments' element={<ScheduleAppt />} />
          <Route
            path='/feedback'
            element={
              <CustomerFeedback
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                userID={userID}
                setUserID={setUserID}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

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

  return (
    <div className='App'>
      <Router>
        <div className='container-fluid' style={{ padding: "1.7rem" }}>
          <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        </div>
        <Routes>
          <Route
            path='/'
            element={<Landing isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          />
          <Route
            path='/training_plans'
            element={
              <TrainingPlans isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            }
          />
          <Route
            path='/appointments'
            element={<ScheduleAppt isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          />
          <Route path='/feedback' element={<CustomerFeedback isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

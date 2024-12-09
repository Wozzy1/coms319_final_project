import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";
import Navbar from "./Navbar";
import TrainingPlans from "./TrainingPlans";
import Landing from "./Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [viewer, setViewer] = useState(0);

  return (
    <div className='App'>
      <Router>
        <div className='container-fluid' style={{ padding: "5rem" }}>
          <Navbar />
        </div>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/training_plans' element={<TrainingPlans />} />

          {/* <Route
            path='/view'
            element={
              <div className='container-fluid' style={{ paddingTop: "5rem" }}>
                <Navbar viewer={viewer} setViewer={setViewer} />
                {viewer === 0 && (
                  <Landing viewer={viewer} setViewer={setViewer} />
                )}
                {viewer === 1 && (
                  <TrainingPlans viewer={viewer} setViewer={setViewer} />
                )}
              </div>
            }
          /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

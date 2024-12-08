import React, { useState } from "react";
import Navbar from "./Navbar";
import TrainingPlans from "./TrainingPlans";
import Landing from "./Landing";

function App() {
  const [viewer, setViewer] = useState(0);

  return (
    <div>
      <Navbar viewer={viewer} setViewer={setViewer} />
      <div className='container-fluid' style={{ paddingTop: "5rem" }}>
        {viewer === 0 && <Landing viewer={viewer} setViewer={setViewer} />}
        {viewer === 1 && (
          <TrainingPlans viewer={viewer} setViewer={setViewer} />
        )}
      </div>
    </div>
  );
}

export default App;

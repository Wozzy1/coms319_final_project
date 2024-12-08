import { useState } from "react";
import Landing from "./Landing";
import TrainingPlans from "./TrainingPlans";

function App() {
  // view handler
  const [viewer, setViewer] = useState(0);

  return (
    <div className='App'>
      <div className='container '>
        <header className='App-header '>Hello World</header>
        {viewer === 0 && <Landing />}
        {viewer === 1 && <TrainingPlans />}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TrainingPlans({ viewer, setViewer }) {
  return (
    <div className='App'>
      <header className='App-header'>Training plans</header>
      <body>
        <button
          type='button'
          class='btn btn-primary'
          onClick={() => {
            setViewer(0);
          }}
        >
          view
        </button>
      </body>
    </div>
  );
}

function viewLanding() {
  setViewer(0);
}

export default TrainingPlans;

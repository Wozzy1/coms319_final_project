import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

function TrainingPlans({ viewer, setViewer }) {
  return (
    <div className='container-fluid'>
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
        <Link to='/view'>
          <button type='button' class='btn btn-primary'>
            view
          </button>
        </Link>
      </body>
    </div>
  );
}

function viewLanding() {
  setViewer(0);
}

export default TrainingPlans;

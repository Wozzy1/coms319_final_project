import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Landing({ viewer, setViewer }) {
  return (
    <div className='App'>
      <header className='App-header'>Landing Page</header>
      <body>
        <button
          type='button'
          class='btn btn-primary'
          onClick={() => {
            setViewer(1);
          }}
        >
          view
        </button>
      </body>
    </div>
  );
}

export default Landing;

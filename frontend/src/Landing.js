import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Landing({ viewer, setViewer }) {
  return (
    <div className='container-fluid'>
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
        <Link to='/'>
          <button type='button' class='btn btn-primary'>
            view
          </button>
        </Link>
      </body>
    </div>
  );
}

export default Landing;

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import { Link } from "react-router-dom";

function Navbar({ viewer, setViewer }) {
  return (
    <div className='App'>
      <header className='App-header'>
        <nav className='navbar fixed-top navbar-expand-lg bg-dark-subtle'>
          <div className='container-fluid '>
            <Link to='/' style={{ textDecoration: "none" }}>
              <a
                className='navbar-brand'
                href='#'
                style={{ paddingLeft: "20px" }}
              >
                Thr33
              </a>
            </Link>
            <div
              className='collapse navbar-collapse'
              id='navbarSupportedContent'
            >
              <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                <li className='nav-item'>
                  <Link to='/' style={{ textDecoration: "none" }}>
                    <a className='nav-link active' aria-current='page' href='#'>
                      Home
                    </a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/training_plans' style={{ textDecoration: "none" }}>
                    <a className='nav-link' href='#'>
                      Training Plans
                    </a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/appointments' style={{ textDecoration: "none" }}>
                    <a className='nav-link' href='#'>
                      Appointments
                    </a>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/feedback' style={{ textDecoration: "none" }}>
                    <a className='nav-link' href='#'>
                      Customer Feedback
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;

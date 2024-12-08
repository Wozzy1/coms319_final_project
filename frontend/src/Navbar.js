import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";

function Navbar({ viewer, setViewer }) {
  return (
    <div className='App'>
      <header className='App-header'>
        <nav className='navbar fixed-top navbar-expand-lg bg-dark-subtle'>
          <div className='container-fluid '>
            <a
              className='navbar-brand'
              href='#'
              style={{ paddingLeft: "20px" }}
            >
              Thr33
            </a>
            <div
              className='collapse navbar-collapse'
              id='navbarSupportedContent'
            >
              <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                <li className='nav-item'>
                  <a
                    className='nav-link active'
                    aria-current='page'
                    href='#'
                    onClick={() => {
                      setViewer(0);
                    }}
                  >
                    Home
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className='nav-link'
                    href='#'
                    onClick={() => {
                      setViewer(1);
                    }}
                  >
                    Training Plans
                  </a>
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

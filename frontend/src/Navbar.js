import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


function Navbar({ isAdmin, setIsAdmin }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch users from the API
      const response = await axios.get("http://localhost:8081/users/list");

      // Check if the username and password are correct
      const user = response.data.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        if (user.username === "Wilson") {
          setIsAdmin(true);
          alert("Login successful. Welcome Admin!");
        } else {
          alert("Login successful. Normal peasant user.");
        }
        setModalVisible(false);
      } else {
        alert("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(
        "An error occurred while trying to log in. Please try again later."
      );
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    alert("You have been logged out.");
  };

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
                    <a className='nav-link' aria-current='page' href='#'>
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
              {isAdmin ? (
                <button
                  className='btn btn-outline-primary'
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              ) : (
                <button
                  className='btn btn-outline-primary'
                  onClick={() => setModalVisible(true)}
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Modal */}
        {modalVisible && (
          <div
            className='modal show'
            tabIndex='-1'
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title'>Log In</h5>
                  <button
                    type='button'
                    className='btn-close'
                    onClick={() => setModalVisible(false)}
                  ></button>
                </div>
                <div className='modal-body'>
                  <form onSubmit={handleLogin}>
                    {error && <p className='text-danger'>{error}</p>}
                    <div className='mb-3'>
                      <label htmlFor='username' className='form-label'>
                        Username
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='password' className='form-label'>
                        Password
                      </label>
                      <input
                        type='password'
                        className='form-control'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type='submit' className='btn btn-primary'>
                      Log In
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Navbar;

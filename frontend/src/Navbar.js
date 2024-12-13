import React, { useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:8081";

function Navbar({ user, setUser }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(""); // Track username input
  const [password, setPassword] = useState(""); // Track password input

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch users from the API
      const response = await fetch(`${BASE_URL}/users/list`);
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
  
      // Parse the response data
      const users = await response.json();
  
      // Check if the username and password match an existing user
      const authenticatedUser = users.find(
        (u) => u.username === username && u.password === password
      );
  
      if (authenticatedUser) {
        // Extract the user's role
        const isAdmin = authenticatedUser.role === "admin";
  
        // Update the user JSON body
        setUser({
          userID: authenticatedUser.id,
          username: authenticatedUser.username,
          password: authenticatedUser.password,
          isAdmin,
          isLoggedIn: true,
        });
        alert(`Login successful. Welcome ${isAdmin ? "Admin!" : "User!"}`);
        setModalVisible(false); // Close modal
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while trying to log in. Please try again.");
    }
  };
  
  const handleLogout = () => {
    setUser({ userID: 0, username: "", password: "", isAdmin: false });
    localStorage.removeItem("user");
    alert("Logged out successfully.");
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <nav className='navbar fixed-top navbar-expand-lg bg-dark-subtle'>
          <div className='container-fluid'>
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
              {user.isLoggedIn ? (
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

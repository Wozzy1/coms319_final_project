import logo from './logo.svg';
import './App.css';
import NavigationBar from './NavBar'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
    <Router>
        <div className="d-flex">
            <NavigationBar />
        </div>
        <Routes>
          <Route path="/" element={<div>This is the homepage, later add a Homepage.js</div>}></Route>
          <Route path="/view_comments" element={<div>This will be a list of comments</div>}></Route>
        </Routes>
    </Router>
</div>
);
}

export default App;

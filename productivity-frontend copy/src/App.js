import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import TaskDetail from "./components/TaskDetail";
// import LoginPage from './pages/LoginPage'; // If implementing a login page
// import { AuthProvider, useAuth } from './context/AuthContext'; // If using AuthContext

// Simple Private Route example (requires AuthContext)
// const PrivateRoute = ({ element, ...rest }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? element : <Navigate to="/login" />;
// };

function App() {
  return (
    // Wrap with AuthProvider if using AuthContext
    // <AuthProvider>
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/tasks">Tasks</Link>
            </li>
            {/* Add Login/Logout links based on authentication state */}
            {/* <li>{isAuthenticated ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}</li> */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h2>Welcome to the Productivity App!</h2>} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          {/* Example Private Route: */}
          {/* <Route path="/tasks" element={<PrivateRoute element={<TaskPage />} />} />
            <Route path="/tasks/:taskId" element={<PrivateRoute element={<TaskDetail />} />} />
            <Route path="/login" element={<LoginPage />} /> */}
          {/* Add routes for other pages (e.g., calendar, habits) */}
        </Routes>
      </div>
    </Router>
    // </AuthProvider>
  );
}

export default App;

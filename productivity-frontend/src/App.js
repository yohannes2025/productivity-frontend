// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Link,
//   Navigate,
// } from "react-router-dom";
// import TaskPage from "./pages/TaskPage";
// import TaskDetail from "./components/TaskDetail";

// // import LoginPage from './pages/LoginPage'; // If implementing a login page
// // import { AuthProvider, useAuth } from './context/AuthContext'; // If using AuthContext

// // Simple Private Route example (requires AuthContext)
// // const PrivateRoute = ({ element, ...rest }) => {
// //   const { isAuthenticated } = useAuth();
// //   return isAuthenticated ? element : <Navigate to="/login" />;
// // };

// function App() {
//   return (
//     // Wrap with AuthProvider if using AuthContext
//     // <AuthProvider>
//     <Router>
//       <div className="App">
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/tasks">Tasks</Link>
//             </li>
//             {/* Add Login/Logout links based on authentication state */}
//             {/* <li>{isAuthenticated ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}</li> */}
//           </ul>
//         </nav>

//         <Routes>
//           <Route path="/" element={<h2>Welcome to the Productivity App!</h2>} />
//           <Route path="/tasks" element={<TaskPage />} />
//           <Route path="/tasks/:taskId" element={<TaskDetail />} />
//           {/* Example Private Route: */}
//           {/* <Route path="/tasks" element={<PrivateRoute element={<TaskPage />} />} />
//             <Route path="/tasks/:taskId" element={<PrivateRoute element={<TaskDetail />} />} />
//             <Route path="/login" element={<LoginPage />} /> */}
//           {/* Add routes for other pages (e.g., calendar, habits) */}
//         </Routes>
//       </div>
//     </Router>
//     // </AuthProvider>
//   );
// }

// export default App;

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
import LoginPage from "./pages/LoginPage"; // Import the Login Page
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider and useAuth
import LoadingSpinner from "./components/LoadingSpinner"; // Import LoadingSpinner

// Private Route component
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Show a spinner while checking auth status
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  // Use useAuth here if you need auth state in the navigation (e.g., show logout)
  // const { isAuthenticated, logout } = useAuth(); // Access auth state if App is inside AuthProvider

  return (
    // Wrap the entire application with AuthProvider
    <AuthProvider>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {/* Conditionally show Tasks link based on authentication */}
              {/* {isAuthenticated && <li><Link to="/tasks">Tasks</Link></li>} */}
              {/* Add Login/Logout links */}
              {/* Use useAuth hook here if you uncomment the above line */}
              {/* <li>{isAuthenticated ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}</li> */}
              {/* Simple links for now */}
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              {/* You'll need a logout button that calls the logout function from useAuth */}
            </ul>
          </nav>

          <Routes>
            <Route
              path="/"
              element={<h2>Welcome to the Productivity App!</h2>}
            />
            <Route path="/login" element={<LoginPage />} />

            {/* Protect the task routes using PrivateRoute */}
            <Route
              path="/tasks"
              element={<PrivateRoute element={<TaskPage />} />}
            />
            <Route
              path="/tasks/:taskId"
              element={<PrivateRoute element={<TaskDetail />} />}
            />

            {/* Add routes for other pages (e.g., calendar, habits) */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

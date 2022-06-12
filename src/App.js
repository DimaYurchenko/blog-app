// import './App.css';
import React from 'react';
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'

const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve('2342f2f1d131rf12'), 250);
  });

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = React.useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);

    const origin = location.state?.from?.pathname || '/dashboard';
    navigate(origin);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Navigation />

      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
};

const Navigation = () => {
  const { token, onLogout } = useAuth();

  return (
    <Navbar bg="light" expand='sm'>
      <Container>
        <Navbar.Brand>SuperBlogApp</Navbar.Brand>
          <Nav className="container-fluid">
            <Nav.Link>
              <NavLink to="/home">Home</NavLink>
            </Nav.Link>
            <Nav.Link >
              <NavLink to="/dashboard">Dashboard</NavLink>
            </Nav.Link>
            <Nav.Item className="ms-auto">
              {token && (
                <Button variant="primary" onClick={onLogout}>Sign Out</Button>
              )}
            </Nav.Item>
          </Nav>
      </Container>
    </Navbar>
  );
};

const Home = () => {
  const { onLogin } = useAuth();

  return (
    <>
      <h2>Home (Public)</h2>

      <button type="button" onClick={onLogin}>
        Sign In
      </button>
    </>
  );
};

const Dashboard = () => {
  const { token } = useAuth();

  return (
    <>
      <h2>Dashboard (Protected)</h2>

      <div>Authenticated as {token}</div>
    </>
  );
};

const Admin = () => {
  return (
    <>
      <h2>Admin (Protected)</h2>
    </>
  );
};

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

export default App;
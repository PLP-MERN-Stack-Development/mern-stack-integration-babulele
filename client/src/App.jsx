// App.jsx - Main application component with routing

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { useNotifications, NotificationContainer } from './components/NotificationContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const AppRoutes = () => {
  const notifications = useNotifications();

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail showNotification={notifications.showNotification} />} />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <PostForm showNotification={notifications.showNotification} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <PostForm showNotification={notifications.showNotification} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
      <NotificationContainer 
        notifications={notifications.notifications} 
        onRemove={notifications.removeNotification} 
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;

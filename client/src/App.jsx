import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ModuleList from './pages/ModuleList.jsx';
import LessonView from './pages/LessonView.jsx';
import Profile from './pages/Profile.jsx';
import Achievements from './pages/Achievements.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          <Route path="/modules" element={<ModuleList />} />
          <Route path="/lesson/:moduleId/:lessonId" element={<LessonView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </main>
    </>
  );
}

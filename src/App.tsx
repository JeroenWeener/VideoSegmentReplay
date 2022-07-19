import styles from './App.module.scss';
import { Route, BrowserRouter, Routes, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Header from './components/header/Header';
import { getProjectsFromStorage } from './utils/local-storage.util';
import { useEffect, useState } from 'react';
import { Project } from './models/project.model';
import ProjectPage from './pages/project-page/ProjectPage';

const App = () => {

  /**
   * Manually calculate true value of 100vh, as mobile browser might report screen height without regarding url bar.
   */
  useEffect(() => {
    const setVhProperty = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    window.addEventListener('resize', setVhProperty)
    return () => window.removeEventListener('resize', setVhProperty)
  }, [])

  return <>
    <BrowserRouter basename={`/${process.env.PUBLIC_URL}`}>
      <Content />
    </BrowserRouter>
  </>;
}

const Content = () => {
  const location = useLocation()
  const [projects, setProjects] = useState<Project[]>(getProjectsFromStorage())

  useEffect(() => {
    setProjects(getProjectsFromStorage)
  }, [location])

  return <>
    <div className={styles.headerContainer}>
      <Header projects={projects} />
    </div>
    <div className={styles.content}>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/project/:projectData" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </>
}

export default App;
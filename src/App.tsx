import './App.css';
import { Route, BrowserRouter, Routes, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import NewProject from './pages/new-project/NewProject';
import Header from './components/header/Header';
import { getProjects } from './utils/local-storage.util';
import { useEffect, useState } from 'react';
import { Project } from './models/project.model';
import ProjectPage from './pages/project-page/ProjectPage';

const App = () => {
  return <>
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  </>;
}

const Content = () => {
  const location = useLocation()
  const [projects, setProjects] = useState<Project[]>(getProjects())

  useEffect(() => {
    setProjects(getProjects)
  }, [location])

  return <>
    <div className='header-container'>
      <Header projects={projects} />
    </div>
    <div className='content'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/projects/:projectData" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </>
}

export default App;
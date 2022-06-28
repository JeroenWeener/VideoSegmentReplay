import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import NewProject from './pages/new-project/NewProject';
import Project from './pages/project/Project';
import Header from './components/header/Header';

const App = () => {
  return <>
    <BrowserRouter>
      <div className='header'>
        <Header />
      </div>
      <div className='content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:projectName/:data" element={<Project />} />
        </Routes>
      </div>
    </BrowserRouter>
  </>;
}

export default App;
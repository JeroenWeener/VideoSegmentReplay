import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import NewProject from './pages/new-project/NewProject';
import Project from './pages/project/Project';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

function App() {
  return <>
    <div className='header'>
      <Header />
    </div>
    <div className='content'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:projectName/:data" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </div>
    <div className='footer'>
      <Footer />
    </div>
  </>;
}

export default App;
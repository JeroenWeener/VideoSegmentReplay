import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();

  const addProject = () => {
    navigate(`../projects/new`);
  }

  return <>
    <button className='button-project-add' onClick={addProject}>Add project</button>
  </>;
}

export default Home;

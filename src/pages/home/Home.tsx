import { useNavigate } from 'react-router-dom';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();

  return <>
    <button className='button-project-add' onClick={() => navigate('../project/new')}>Add project</button>
  </>;
}

export default Home;

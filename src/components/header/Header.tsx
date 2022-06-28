import { useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
    const navigate = useNavigate()

    return <div className="header">
        <div className='header-content'>
            <div className='logo' onClick={() => navigate('/')}>
                <span>V</span>
                <span className='logo-appear'>ideo</span>
                <span>S</span>
                <span className='logo-appear'>egment</span>
                <span>R</span>
                <span className='logo-appear'>eplay</span>
            </div>
        </div>
    </div>
}

export default Header
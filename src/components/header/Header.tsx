import { useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
    const navigate = useNavigate()

    const navigateToHome = () => {
        navigate(`/`)
    }

    return <div className="header">
        <div className='header-content'>
            <div className='logo' onClick={navigateToHome}>
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
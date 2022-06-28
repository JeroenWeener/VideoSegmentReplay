import { useNavigate } from 'react-router-dom'
import { Project } from '../../models/project.model'
import './Header.css'

interface HeaderProps {
    projects: Project[]
}

const Header = ({ projects }: HeaderProps) => {
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

            <select>{ projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
        </div>
    </div>
}

export default Header
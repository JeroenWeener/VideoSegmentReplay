import { useNavigate } from 'react-router-dom'
import { Project } from '../../models/project.model'
import ProjectDropdown from '../project-dropdown/ProjectDropdown'
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

            <ProjectDropdown projects={projects} />
        </div>
    </div>
}

export default Header
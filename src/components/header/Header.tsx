import { useNavigate } from 'react-router-dom'
import { Project } from '../../models/project.model'
import ProjectDropdown from '../project-dropdown/ProjectDropdown'
import styles from './Header.module.scss'

interface HeaderProps {
    projects: Project[]
}

const Header = ({ projects }: HeaderProps) => {
    const navigate = useNavigate()

    return <div className={styles.header}>
        <div className={styles.headerContent}>
            <div className={styles.logo} onClick={() => navigate('/')}>
                <span>V</span>
                <span className={styles.logoAppear}>ideo</span>
                <span>S</span>
                <span className={styles.logoAppear}>egment</span>
                <span>R</span>
                <span className={styles.logoAppear}>eplay</span>
            </div>

            <ProjectDropdown projects={projects} />
        </div>
    </div>
}

export default Header
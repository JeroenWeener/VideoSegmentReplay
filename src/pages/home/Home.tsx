import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectDialog from '../../components/project-dialog/ProjectDialog';
import ProjectItem from '../../components/project-item/ProjectItem';
import { Project } from '../../models/project.model';
import { deleteProjectFromStorage, getProjectsFromStorage } from '../../utils/local-storage.util';
import { buildNewProject, projectToBase64, sortProjects } from '../../utils/project.util';
import styles from './Home.module.scss'

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(getProjectsFromStorage())
  const [projectDialogOpened, setProjectDialogOpened] = useState<boolean>(false)

  const handleProjectSelect = (project: Project) => {
    navigate(`../project/${projectToBase64(project)}`)
  }

  const handleProjectDelete = (project: Project) => {
    const remainingProjects = deleteProjectFromStorage(project)
    setProjects(remainingProjects)
  }

  const handleProjectCreate = (projectName: string, videoId: string) => {
    handleProjectSelect(buildNewProject(projectName, videoId))
  }

  return <>
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h2>Projects</h2>
        <button className={styles.buttonProjectAdd} onClick={() => setProjectDialogOpened(true)}>New project</button>
      </div>

      <div className={styles.projectContainer}>
        {sortProjects(projects).map((project, index) =>
          <div
            key={index}
            className={styles.projectRow}
          >
            <ProjectItem
              project={project}
              onSelect={() => handleProjectSelect(project)}
              onDelete={() => handleProjectDelete(project)}
            />
          </div>
        )}
      </div>
    </div>

    {projectDialogOpened && <ProjectDialog onCreate={handleProjectCreate} onClose={() => setProjectDialogOpened(false)} />}
  </>
}

export default Home;

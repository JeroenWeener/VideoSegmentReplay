import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectDialog from '../../components/project-dialog/ProjectDialog';
import ProjectItem from '../../components/project-item/ProjectItem';
import { Project } from '../../models/project.model';
import { deleteProjectFromStorage, getProjectsFromStorage } from '../../utils/local-storage.util';
import { projectToBase64 } from '../../utils/project.util';
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
    const newProject = { name: projectName, videoId: videoId, moments: [] }
    handleProjectSelect(newProject)
  }

  return <>
    <div className={styles.homeContainer}>
      <button className={styles.buttonProjectAdd} onClick={() => setProjectDialogOpened(true)}>New project</button>

      <div className={styles.projectContainer}>
        <div className={styles.projectRows}>
          {projects.sort((a, b) => a.name.localeCompare(b.name)).map((project, index) =>
            <ProjectItem
              key={index}
              project={project}
              onSelect={() => handleProjectSelect(project)}
              onDelete={() => handleProjectDelete(project)}
            />
          )}
        </div>
      </div>
    </div>

    {projectDialogOpened && <ProjectDialog onCreate={handleProjectCreate} onClose={() => setProjectDialogOpened(false)} />}
  </>
}

export default Home;

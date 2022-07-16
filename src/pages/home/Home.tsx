import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectDialog from '../../components/project-dialog/ProjectDialog';
import ProjectItem from '../../components/project-item/ProjectItem';
import { Project } from '../../models/project.model';
import { deleteProjectFromStorage, getProjectsFromStorage } from '../../utils/local-storage.util';
import { projectToBase64 } from '../../utils/project.util';
import './Home.css'

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
    <div className='home-container'>
      <button className='button-project-add' onClick={() => setProjectDialogOpened(true)}>Add project</button>

      <div className='project-container'>
        <div className="project-rows">
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

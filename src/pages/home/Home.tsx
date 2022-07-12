import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectItem from '../../components/project-item/ProjectItem';
import { Project } from '../../models/project.model';
import { deleteProject, getProjects } from '../../utils/local-storage.util';
import { projectToBase64 } from '../../utils/project.util';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(getProjects())

  const handleProjectSelect = (project: Project) => {
    navigate(`../project/${projectToBase64(project)}`)
  }

  const handleProjectDelete = (project: Project) => {
    const remainingProjects = deleteProject(project)
    setProjects(remainingProjects)
  }

  return <>
    <div className='project-container'>
      <div className="project-rows">
        {projects.map((project, index) =>
          <ProjectItem
            key={index}
            project={project}
            onSelect={() => handleProjectSelect(project)}
            onDelete={() => handleProjectDelete(project)}
          />
        )}
      </div>
    </div>
    <button className='button-project-add' onClick={() => navigate('../project/new')}>Add project</button>
  </>;
}

export default Home;

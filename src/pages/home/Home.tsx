import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectItem from '../../components/project-item/ProjectItem';
import { Project } from '../../models/project.model';
import { deleteProject, getProjects } from '../../utils/local-storage.util';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(getProjects())

  const handleProjectDelete = (project: Project) => {
    const remainingProjects = deleteProject(project)
    setProjects(remainingProjects)
  }

  return <>
    <div className='project-container'>
      {projects.map((project, index) => <ProjectItem key={index} project={project} onDelete={() => handleProjectDelete(project)} />)}
    </div>
    <button className='button-project-add' onClick={() => navigate('../project/new')}>Add project</button>
  </>;
}

export default Home;

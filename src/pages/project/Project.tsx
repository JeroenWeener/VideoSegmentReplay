import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MomentPanel from '../../components/moment-panel/MomentPanel';
import { Moment } from '../../models/moment.model';

const Project = () => {
  const navigate = useNavigate();
  const { projectName, data } = useParams();
  const { url, moments: parsedMoments } = JSON.parse(data!);
  const [moments, setMoments] = useState(parsedMoments);

  const getProjectDataString = () => {
    return JSON.stringify({
      url,
      moments,
    })
  }

  const addMoment = () => {
    const updatedMoments = moments;
    updatedMoments.push({
      id: 9,
      time: 3.4,
    });
    setMoments(updatedMoments);

    navigate(`../projects/${projectName}/${getProjectDataString()}`, { replace: true })
  }

  const panels = moments.map((moment: Moment) => <MomentPanel key={moment.id} moment={moment} />)

  return <>
    <div>Project name: {projectName}</div>
    <div>YouTube URL: {url}</div>
    <button onClick={addMoment}>Add moment</button>
    {panels}
  </>;
}

export default Project;
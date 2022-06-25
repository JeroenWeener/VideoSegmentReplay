import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MomentPanel from '../../components/moment-panel/MomentPanel';
import { Moment } from '../../models/moment.model';
import YouTube, { YouTubeProps } from 'react-youtube';
import './Project.css'

const Project = () => {
  const navigate = useNavigate()
  const { projectName, data } = useParams()
  const { videoId, moments: parsedMoments } = JSON.parse(data!)
  const [moments, setMoments] = useState(parsedMoments)
  const [playing, setPlaying] = useState(false)

  const getProjectDataString = () => {
    return JSON.stringify({
      videoId,
      moments,
    })
  }

  let player: YT.Player;

  const addMoment = () => {
    const updatedMoments = moments
    updatedMoments.push({
      id: 9,
      time: 3.4,
    })
    setMoments(updatedMoments)

    navigate(`../projects/${projectName}/${getProjectDataString()}`, { replace: true })
  }

  const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  const panels = moments.map((moment: Moment) => <MomentPanel key={moment.id} moment={moment} />)

  const togglePlayState = () => {
    if (playing) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
    setPlaying(!playing)
  }

  const updatePlayer: YouTubeProps['onPlay' | 'onPause'] = (event) => {
    player = event.target;
  }

  return <>
    <div className='project-container'>
      <div>Project name: {projectName}</div>
      <div>YouTube video ID: {videoId}</div>
      <button onClick={addMoment}>Add moment</button>
      {panels}
    </div>
    <div className='player-controls'>
      <button onClick={togglePlayState} className={`button-action ${playing ? 'pause' : ''}`}></button>
    </div>
    <YouTube
      style={{display: 'none'}}
      onReady={updatePlayer}
      onPlay={updatePlayer}
      onPause={updatePlayer}
      videoId={videoId}
      opts={opts}
    />
  </>;
}

export default Project;
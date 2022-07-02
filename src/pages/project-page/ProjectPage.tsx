import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Moment } from '../../models/moment.model'
import { YouTubeProps } from 'react-youtube'
import './ProjectPage.css'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'
import { projectFromBase64, projectToBase64 } from '../../utils/project.util'
import { Project } from '../../models/project.model'
import MomentPanelContainer from '../../components/moment-panel-container/MomentPanelContainer'

const ProjectPage = () => {
  const navigate = useNavigate()
  const { projectData } = useParams()
  const [project, setProject] = useState<Project>()
  const [player, setPlayer] = useState<YT.Player>()
  const [playing, setPlaying] = useState<boolean>(false)
  const [ended, setEnded] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  // Load project from URL
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadProjectFromUrl(), [])

  // Update current time in 120 fps
  useEffect(() => {
    const interval = setInterval(() => {
      const playerState = player?.getPlayerState()
      setCurrentTime((previousTime: number) => player?.getCurrentTime() || previousTime)
      setPlaying(playerState !== YT.PlayerState.PAUSED && playerState !== YT.PlayerState.ENDED)
      setEnded(playerState === YT.PlayerState.ENDED)
    }, 1000 / 120)
    return () => clearInterval(interval)
  }, [player])

  const loadProjectFromUrl = () => {
    if (projectData) {
      const supposedProject = projectFromBase64(projectData)
      if (supposedProject) {
        setProject(supposedProject)
        return
      }
    }
    // Return to home if project data is corrupt
    navigate('/')
  }

  document.body.onkeydown = (e) => {
    if (
      e.key === ' ' ||
      e.code === 'Space' ||
      e.keyCode === 32
    ) {
      e.preventDefault()
      playing ? pause() : play()
    }

    if (
      e.key === 'ArrowLeft' ||
      e.code === 'ArrowLeft' ||
      e.keyCode === 37
    ) {
      e.preventDefault()
      seek(currentTime - 5)
    }

    if (
      e.key === 'ArrowRight' ||
      e.code === 'ArrowRight' ||
      e.keyCode === 39
    ) {
      e.preventDefault()
      seek(currentTime + 5)
    }

    if (
      e.key === 'j' ||
      e.code === 'KeyJ' ||
      e.keyCode === 74
    ) {
      e.preventDefault()
      seek(currentTime - 10)
    }

    if (
      e.key === 'l' ||
      e.code === 'KeyL' ||
      e.keyCode === 76
    ) {
      e.preventDefault()
      seek(currentTime + 10)
    }

    if (
      e.key === 'k' ||
      e.code === 'KeyK' ||
      e.keyCode === 75
    ) {
      e.preventDefault()
      playing ? pause() : play()
    }
  }

  const updateMoments = (moments: Moment[]) => {
    const updatedProject = {
      ...project!,
      moments,
    }
    setProject(updatedProject)
    navigate(`../project/${projectToBase64(updatedProject)}`, { replace: true })
  }

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target)
    setDuration(Math.round(event.target.getDuration() * 10) / 10)
  }

  const play = () => {
    player?.playVideo()
  }

  const pause = () => {
    player?.pauseVideo()
  }

  const seek = (seconds: number) => {
    player?.seekTo(seconds, true)
  }

  return <>
    {project &&
      <div className="content-container">
        <div className="player-container">
          <VideoPlayer
            videoId={project.videoId}
            playing={playing}
            ended={ended}
            onReady={onReady}
            onPlay={play}
            onPause={pause}
          ></VideoPlayer>
        </div>
        <div className="moments-container">
          <MomentPanelContainer
            moments={project.moments}
            momentsUpdated={(moments) => updateMoments(moments)}
            currentTime={currentTime}
            seekTo={seek}
          />
        </div>
      </div>
    }

    <PlayerControl
      playing={playing}
      currentTime={currentTime}
      duration={duration}
      onPlay={play}
      onPause={pause}
      onSeek={seek}
    ></PlayerControl>
  </>
}

export default ProjectPage
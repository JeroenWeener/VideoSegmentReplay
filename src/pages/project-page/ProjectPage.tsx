import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Moment } from '../../models/moment.model'
import './ProjectPage.css'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'
import { projectFromBase64, projectToBase64 } from '../../utils/project.util'
import { Project } from '../../models/project.model'
import MomentPanelContainer from '../../components/moment-panel-container/MomentPanelContainer'
import ReactPlayer from 'react-player'
import ShortcutListener from '../../components/shortcut-listener/ShortcutListener'

const ProjectPage = () => {
  const navigate = useNavigate()
  const { projectData } = useParams()

  const [project, setProject] = useState<Project>()
  // Expose player to seek, as this is not directly supported by ReactPlayer
  const [player, setPlayer] = useState<ReactPlayer>()
  const [playing, setPlaying] = useState<boolean>(false)
  const [ended, setEnded] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  // Load project from URL
  useEffect(() => {
    loadProjectFromUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const updateMoments = (moments: Moment[]) => {
    const updatedProject = {
      ...project!,
      moments,
    }
    setProject(updatedProject)
    navigate(`../project/${projectToBase64(updatedProject)}`, { replace: true })
  }

  const play = () => {
    setPlaying(true)
    setEnded(false)
  }

  const pause = () => {
    setPlaying(false)
  }

  const end = () => {
    setPlaying(false)
    setEnded(true)
  }

  const toggle = () => {
    playing ? pause() : play()
  }

  const progress = (seconds: number) => {
    if (!ended) {
      setCurrentTime(seconds)
    }
  }

  const seek = (seconds: number) => {
    let s = seconds < 0 ? 0 : seconds
    s = s > duration ? duration : s
    setEnded(s === duration)
    setCurrentTime(s)
    player?.seekTo(s, 'seconds')
  }

  const seekAndPlay = (seconds: number) => {
    seek(seconds)
    play()
  }

  return <>
    {project &&
      <div className="content-container">
        <div className="player-container">
          <VideoPlayer
            videoId={project.videoId}
            playing={playing}
            onPlay={play}
            onPause={pause}
            onProgress={progress}
            onEnded={end}
            setDuration={setDuration}
            setPlayer={setPlayer}
          ></VideoPlayer>
        </div>
        <div className="moments-container">
          <MomentPanelContainer
            playing={playing}
            moments={project.moments}
            momentsUpdated={updateMoments}
            currentTime={currentTime}
            duration={duration}
            seekTo={seekAndPlay}
            onPause={pause}
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

    <ShortcutListener
      onToggle={toggle}
      onSeekRelative={(seconds) => seek(currentTime + seconds)}
    />
  </>
}

export default ProjectPage
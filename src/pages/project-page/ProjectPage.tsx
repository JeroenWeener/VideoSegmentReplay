import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Moment } from '../../models/moment.model'
import './ProjectPage.css'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'
import { projectFromBase64, projectToBase64 } from '../../utils/project.util'
import MomentPanelContainer from '../../components/moment-panel-container/MomentPanelContainer'
import ReactPlayer from 'react-player'
import ShortcutListener from '../../components/shortcut-listener/ShortcutListener'
import { addProjectToStorage, retrieveVolume, storeVolume, updateProjectInStorage } from '../../utils/local-storage.util'
import CurrentProjectService from '../../services/current-project-service'

const currentProjectService = CurrentProjectService.getInstance()

const ProjectPage = () => {
  const navigate = useNavigate()
  const { projectData } = useParams()

  // Expose player to seek, as this is not directly supported by ReactPlayer
  const [player, setPlayer] = useState<ReactPlayer>()
  const [playing, setPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(retrieveVolume())
  const [ended, setEnded] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [lastUserUpdate, setLastUserUpdate] = useState<number>(Date.now())

  const project = currentProjectService.getCurrentProject()

  useEffect(() => {
    if (projectData) {
      const supposedProject = projectFromBase64(projectData)
      if (supposedProject) {
        setPlaying(false)
        setEnded(false)
        addProjectToStorage(supposedProject)
        currentProjectService.setCurrentProject(supposedProject)
        return
      }
    }
    // Return to home if project data is corrupt
    navigate('/')
  }, [navigate, projectData])

  /**
   * componentWillUnmount
   */
  useEffect(() => {
    return () => currentProjectService.setCurrentProject(null)
  }, [])

  useEffect(() => {
    storeVolume(volume)
  }, [volume])

  const handleMomentsUpdate = (moments: Moment[]) => {
    const updatedProject = {
      ...project!,
      moments,
    }
    updateProjectInStorage(project!, updatedProject)
    navigate(`../project/${projectToBase64(updatedProject)}`, { replace: true })
  }

  const handlePlay = () => {
    setPlaying(true)
    setEnded(false)
  }

  const handlePause = () => {
    setPlaying(false)
  }

  const handleEnd = () => {
    setPlaying(false)
    setEnded(true)
  }

  const handleToggle = () => {
    playing ? handlePause() : handlePlay()
  }

  /**
   * Set current time. This method is called continuously by the VideoPlayer.
   * 
   * Because users can influence the current time in various ways, their might be a delay between the current time set by the user
   * and the current time reported by the player. To remedy this, updates from the video player are dropped for the first 100 ms after
   * a user update.
   * @param seconds the new current time in seconds 
   */
  const handlePlayerProgress = (seconds: number) => {
    if (!ended) {
      if (Date.now() - lastUserUpdate > 100) {
        setCurrentTime(seconds)
      }
    }
  }

  /**
   * Seeks player to provided time. This method is called by user interaction only.
   * 
   * Because there might be a delay between setting the time and the player actually playing at that time
   * we drop updates from the player for a while after issuing this method. Therefore, we need to store
   * a timestamp of when this method last ran.
   * 
   * @param seconds proposed new current time for player in seconds
   */
  const handleSeek = (seconds: number) => {
    setLastUserUpdate(Date.now())
    let s = seconds < 0 ? 0 : seconds
    s = s > duration ? duration : s
    setEnded(s === duration)
    setCurrentTime(s)
    player?.seekTo(s, 'seconds')
  }

  const handleSeekAndPlay = (seconds: number) => {
    handleSeek(seconds)
    handlePlay()
  }

  return <>
    {project &&
      <div className="content-container">
        <div className="player-container">
          <VideoPlayer
            videoId={project.videoId}
            playing={playing}
            volume={volume}
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handlePlayerProgress}
            onEnded={handleEnd}
            setDuration={setDuration}
            setPlayer={setPlayer}
          ></VideoPlayer>
        </div>
        <div className="moments-container">
          <MomentPanelContainer
            playing={playing}
            moments={project.moments}
            updateMoments={handleMomentsUpdate}
            currentTime={currentTime}
            seekTo={handleSeekAndPlay}
          />
        </div>
      </div>
    }

    <PlayerControl
      playing={playing}
      volume={volume}
      currentTime={currentTime}
      duration={duration}
      onPlay={handlePlay}
      onPause={handlePause}
      onSeek={handleSeek}
      setVolume={setVolume}
    ></PlayerControl>

    <ShortcutListener
      onMute={() => setVolume(volume === 0 ? 100 : 0)}
      onToggle={handleToggle}
      onSeekRelative={(seconds) => handleSeek(currentTime + seconds)}
    />
  </>
}

export default ProjectPage
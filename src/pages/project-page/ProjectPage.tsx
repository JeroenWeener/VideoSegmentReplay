import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Moment } from '../../models/moment.model'
import styles from './ProjectPage.module.scss'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'
import { areEqualProjects, projectFromBase64, projectToBase64 } from '../../utils/project.util'
import MomentPanelContainer from '../../components/moment-panel-container/MomentPanelContainer'
import ReactPlayer from 'react-player'
import ShortcutListener from '../../components/shortcut-listener/ShortcutListener'
import { addProjectToStorage, retrieveVolume, storeVolume, updateProjectInStorage } from '../../utils/local-storage.util'
import CurrentProjectService from '../../services/current-project-service'
import { Project, UnidentifiedProject } from '../../models/project.model'

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
      const supposedProject: UnidentifiedProject | null = projectFromBase64(projectData)
      if (supposedProject) {
        // Reset player parameters if a new project is loaded
        if (!project || !areEqualProjects(project, supposedProject)) {
          setPlaying(false)
          setEnded(false)
          const addedProject: Project = addProjectToStorage(supposedProject)
          currentProjectService.setCurrentProject(addedProject)
        }
        return
      }
    }
    // Return to home if project data is corrupt
    navigate('/')

    // project is not a dependency as it is only set within this effect. Adding it as a dependency causes a callback loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /**
   * Updates the project:
   * - updates project in storage
   * - sets current project in service
   * - update URL
   * 
   * @param updatedProject the updated project
   */
  const updateProject = (updatedProject: Project) => {
    updateProjectInStorage(updatedProject)
    currentProjectService.setCurrentProject(updatedProject)
    navigate(`../project/${projectToBase64(updatedProject)}`, { replace: true })
  }

  /**
   * Updates the moments of the project by calling updateProject()
   * 
   * @param moments the updated moments
   */
  const handleMomentsUpdate = (moments: Moment[]) => {
    const updatedProject = {
      ...project!,
      moments,
    }
    updateProject(updatedProject)
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
      <div className={styles.contentContainer}>
        <div className={styles.playerContainer}>
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
        <div className={styles.momentsContainer}>
          <MomentPanelContainer
            key={project.id}
            playing={playing}
            initialMoments={project.moments}
            currentTime={currentTime}
            onUpdateMoments={handleMomentsUpdate}
            onSeekTo={handleSeekAndPlay}
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
import { SetStateAction, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MomentPanel from '../../components/moment-panel/MomentPanel'
import { Moment } from '../../models/moment.model'
import { YouTubeProps } from 'react-youtube'
import './ProjectPage.css'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'
import { projectFromBase64, projectToBase64 } from '../../utils/project.util'
import { Project } from '../../models/project.model'
import NewMomentPanel from '../../components/new-moment-panel/NewMomentPanel'

const ProjectPage = () => {
  const navigate = useNavigate()
  const { projectData } = useParams()
  const [project, setProject] = useState<Project>()
  const [playing, setPlaying] = useState<boolean>(false)
  const [player, setPlayer] = useState<YT.Player>()
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [ended, setEnded] = useState<boolean>(false)

  // Load project from URL
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadProjectFromUrl(), [])

  // Update current time in 120 fps
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeFn((previousTime: number) => player?.getCurrentTime() || previousTime)
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
      return false
    }
  }

  const createMoment = () => {
    const updatedMoments = project!.moments
    updatedMoments.push({
      startTime: currentTime,
      endTime: currentTime + 10,
    })

    const updatedProject = {
      ...project!,
      moments: updatedMoments,
    }
    setProject(updatedProject)

    navigate(`../project/${projectToBase64(updatedProject)}`, { replace: true })
  }

  const deleteMoment = (momentIndex: number) => {
    const updatedProject = {
      ...project!,
      moments: project!.moments.filter((_, i) => i !== momentIndex),
    }
    setProject(updatedProject)

    navigate(`../project/${projectToBase64(updatedProject)}`, { replace: true })
  }

  const setTime = (seconds: number) => {
    setCurrentTime(Math.ceil(seconds * 1000) / 1000)
  }

  const setTimeFn = (fn: SetStateAction<number>) => {
    setCurrentTime(fn)
  }

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target)
    setDuration(Math.floor((player?.getDuration() || 0) * 1000) / 1000)
  }

  const play = () => {
    player?.playVideo()
    setPlaying(true)
    setEnded(false)
  }

  const pause = () => {
    player?.pauseVideo()
    setPlaying(false)
  }

  const onEnd = () => {
    setPlaying(false)
    setEnded(true)
  }

  const seekAndPlay = (seconds: number) => {
    setTime(seconds)
    player?.seekTo(seconds, true)
    play()
  }

  const momentClicked = (moment: Moment) => {
    seekAndPlay(moment.startTime)
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
            onEnd={onEnd}
          ></VideoPlayer>
        </div>
        <div className="moments-container">
          <div className='panel-container'>
            {project.moments.map((moment: Moment, index: number) =>
              <MomentPanel
                key={index}
                currentTime={currentTime}
                moment={moment}
                onStart={() => momentClicked(moment)}
                onDelete={() => deleteMoment(index)}
              />
            )}
            <NewMomentPanel onClick={createMoment} />
            {project.moments.length === 0 &&
              <div style={{ visibility: 'hidden' }}><NewMomentPanel /></div>
            }
          </div>
        </div>
      </div>
    }

    <PlayerControl
      playing={playing}
      currentTime={currentTime}
      duration={duration}
      onPlay={play}
      onPause={pause}
      onSeek={seekAndPlay}
    ></PlayerControl>
  </>
}

export default ProjectPage
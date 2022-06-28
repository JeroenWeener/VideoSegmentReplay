import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MomentPanel from '../../components/moment-panel/MomentPanel'
import { Moment } from '../../models/moment.model'
import { YouTubeProps } from 'react-youtube'
import './ProjectPage.css'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'
import { projectFromBase64, projectToBase64 } from '../../utils/project.util'
import { Project } from '../../models/project.model'

const ProjectPage = () => {
  const navigate = useNavigate()
  const { projectData } = useParams()
  const [project, setProject] = useState<Project>()
  const [playing, setPlaying] = useState<boolean>(false)
  const [player, setPlayer] = useState<YT.Player>()
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [ended, setEnded] = useState<boolean>(false)

  useEffect(() => {
    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMount = () => {
    loadProjectFromUrl()
  }

  document.body.onkeyup = (e) => {
    if (
      e.key === ' ' ||
      e.code === 'Space' ||
      e.keyCode === 32
    ) {
      playing ? pause() : play()
      return false
    }
  }

  setInterval(() => {
    if (player && playing && player.getCurrentTime() !== 0) {
      setTime(player.getCurrentTime())
    }
  }, 500)

  const loadProjectFromUrl = () => {
    if (projectData) {
      const supposedProject = projectFromBase64(projectData)
      if (supposedProject) {
        setProject(supposedProject)
        return
      }
    }
    navigate('/')
  }

  const addMoment = () => {
    const updatedMoments = project!.moments
    updatedMoments.push({
      time: currentTime,
    })

    const updatedProject = {
      ...project!,
      updatedMoments,
    }
    setProject(updatedProject)

    navigate(`../projects/${projectToBase64(updatedProject)}`, { replace: true })
  }

  const setTime = (seconds: number) => {
    setCurrentTime(Math.ceil(seconds))
  }

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target)
    setDuration(Math.floor(player?.getDuration() || 0))
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
    seekAndPlay(moment.time)
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
          <button onClick={addMoment}>Add moment</button>
          <div className='panel-container'>
            {project.moments.map((moment: Moment, index: number) => <MomentPanel key={index} moment={moment} onClick={() => momentClicked(moment)} />)}
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
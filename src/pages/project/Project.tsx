import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MomentPanel from '../../components/moment-panel/MomentPanel'
import { Moment } from '../../models/moment.model'
import YouTube, { YouTubeProps } from 'react-youtube'
import './Project.css'

const Project = () => {
  const navigate = useNavigate()
  const { projectName, data } = useParams()
  const { videoId, moments: parsedMoments } = JSON.parse(data!)
  const [moments, setMoments] = useState(parsedMoments || [])
  const [playing, setPlaying] = useState(false)
  const [player, setPlayer] = useState<YT.Player>()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const getProjectDataString = () => {
    return JSON.stringify({
      videoId,
      moments,
    })
  }

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
  }

  setInterval(() => {
    if (player && playing && player.getCurrentTime() !== 0) {
      setTime(player.getCurrentTime())
    }
  }, 500)

  const setTime = (seconds: number) => {
    setCurrentTime(Math.ceil(seconds))
  }

  const panels = moments.map((moment: Moment) => <MomentPanel key={moment.id} moment={moment} />)

  const onReady: YouTubeProps['onReady'] = (event) => {
    console.log(`onReady ${event}`)
    setPlayer(event.target)
    setDuration(Math.floor(player?.getDuration() || 0))
  }

  const play = () => {
    player?.playVideo()
    setPlaying(true)
  }

  const pause = () => {
    player?.pauseVideo()
    setPlaying(false)
  }

  const onEnd = () => {
    setPlaying(false)
  }

  const seekAndPlay = (seconds: number) => {
    setTime(seconds)
    player?.seekTo(seconds, true)
    play()
  }

  const getTimeString = () => {
    if (!player) return ''
    const currentMinutes = Math.floor(currentTime / 60)
    const currentSeconds = currentTime % 60
    const currentSecondsString = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds
    const totalMinutes = Math.floor(duration / 60)
    const totalSeconds = duration % 60
    const totalSecondsString = totalSeconds >= 10 ? totalSeconds : '0' + totalSeconds
    return `${currentMinutes}:${currentSecondsString} / ${totalMinutes}:${totalSecondsString}`
  }

  return <>
    <div className='project-container'>
      <div>Project name: {projectName}</div>
      <div>YouTube video ID: {videoId}</div>
      <button onClick={addMoment}>Add moment</button>
      {panels}
    </div>
    <div className='player-controls'>
      <button onClick={() => playing ? pause() : play()} className={`button-action ${playing ? 'pause' : ''}`}></button>
      <span className='clock'>{getTimeString()}</span>
      <input
        type="range"
        min="0"
        max={duration}
        onChange={(e) => seekAndPlay(+e.target.value)}
        value={currentTime}
        className='seek-bar'
      ></input>
    </div>
    <YouTube
      style={{ display: 'none' }}
      onReady={onReady}
      onEnd={onEnd}
      videoId={videoId}
      opts={opts}
    />
  </>
}

export default Project
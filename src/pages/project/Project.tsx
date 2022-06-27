import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MomentPanel from '../../components/moment-panel/MomentPanel'
import { Moment } from '../../models/moment.model'
import YouTube, { YouTubeProps } from 'react-youtube'
import './Project.css'
import { secondsToHMSString } from '../../utils/moment.util'

const Project = () => {
  const navigate = useNavigate()
  const { projectName, data } = useParams()
  const { videoId, moments: parsedMoments } = JSON.parse(data!)
  const [moments, setMoments] = useState<Moment[]>(parsedMoments || [])
  const [playing, setPlaying] = useState<boolean>(false)
  const [player, setPlayer] = useState<YT.Player>()
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [ended, setEnded] = useState<boolean>(false)

  const getProjectDataString = () => {
    return JSON.stringify({
      videoId,
      moments,
    })
  }

  const addMoment = () => {
    const updatedMoments = moments
    updatedMoments.push({
      time: currentTime,
    })
    setMoments(updatedMoments)

    navigate(`../projects/${projectName}/${getProjectDataString()}`, { replace: true })
  }

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      cc_load_policy: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modest_branding: 1,
      rel: 0,
    },
  }

  setInterval(() => {
    if (player && playing && player.getCurrentTime() !== 0) {
      setTime(player.getCurrentTime())
    }
  }, 500)

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

  const setTime = (seconds: number) => {
    setCurrentTime(Math.ceil(seconds))
  }

  const onReady: YouTubeProps['onReady'] = (event) => {
    console.log(`onReady ${event}`)
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

  const getTimeString = () => {
    if (!player || duration === 0) return '-:-- / -:--'

    const totalHMS = secondsToHMSString(duration)
    const currentHMS = secondsToHMSString(currentTime, totalHMS.length > '--:--'.length)
    return `${currentHMS} / ${totalHMS}`
  }

  const momentClicked = (moment: Moment) => {
    seekAndPlay(moment.time)
  }

  return <div className='outer-container'>
    <div className='project-container'>
      <div>
        <div>Project name: {projectName}</div>
        <div>YouTube video ID: {videoId}</div>
        <div className='video-player-wrapper'>
          <YouTube
            title=' '
            onReady={onReady}
            onEnd={onEnd}
            videoId={videoId}
            opts={opts}
          />
          <div
            className={`
            video-player-cover
            ${playing ? '' : 'paused'}
            ${ended ? 'ended' : ''}
          `}
            onClick={() => playing ? pause() : play()}
          ></div>
        </div>
      </div>
      <div>
        <button onClick={addMoment}>Add moment</button>
        <div className='panel-container'>
          {moments.map((moment: Moment, index: number) => <MomentPanel key={index} moment={moment} onClick={() => momentClicked(moment)} />)}
        </div>
      </div>
    </div>
    
    <div className='player-controls'>
      <button onClick={() => playing ? pause() : play()} className={`button-action ${playing ? 'pause' : ''}`}></button>
      <span className='time-display'>{getTimeString()}</span>
      <input
        type="range"
        min="0"
        max={duration}
        onChange={(e) => seekAndPlay(+e.target.value)}
        value={currentTime}
        className='seek-bar'
      ></input>
    </div>
  </div>
}

export default Project
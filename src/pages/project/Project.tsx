import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MomentPanel from '../../components/moment-panel/MomentPanel'
import { Moment } from '../../models/moment.model'
import YouTube, { YouTubeProps } from 'react-youtube'
import './Project.css'
import PlayerControl from '../../components/player-control/PlayerControl'
import VideoPlayer from '../../components/video-player/VideoPlayer'

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

  const momentClicked = (moment: Moment) => {
    seekAndPlay(moment.time)
  }

  return <>
    <div className="content-container">
      <div className="player-side">
        <VideoPlayer
          videoId={videoId}
          playing={playing}
          ended={ended}
          onReady={onReady}
          onPlay={play}
          onPause={pause}
          onEnd={onEnd}
        ></VideoPlayer>
      </div>
      <div className="moments-side">
        <button onClick={addMoment}>Add moment</button>
        <div className='panel-container'>
          {moments.map((moment: Moment, index: number) => <MomentPanel key={index} moment={moment} onClick={() => momentClicked(moment)} />)}
        </div>
      </div>
    </div>

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

export default Project
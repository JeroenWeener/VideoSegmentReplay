import { secondsToHMSString } from "../../utils/moment.util"
import './PlayerControl.css'

interface PlayerControlProps {
  playing: boolean
  volume: number
  currentTime: number
  duration: number

  onPlay: () => void
  onPause: () => void
  onSeek: (seconds: number) => void
  setVolume: (volume: number) => void
}

const PlayerControl = ({
  playing,
  volume,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeek,
  setVolume,
}: PlayerControlProps) => {
  const getTimeString = () => {
    if (duration === 0) return '-:-- / -:--'

    const totalHMS = secondsToHMSString(duration)
    const currentHMS = secondsToHMSString(currentTime, totalHMS.length > '--:--'.length)
    return `${currentHMS} / ${totalHMS}`
  }

  return <div className="player-controls">
    <button onClick={() => playing ? onPause() : onPlay()} className={`button-action ${playing ? 'pause' : ''}`} />
    <button onClick={() => volume === 0 ? setVolume(100) : setVolume(0)} className={`button-mute ${volume === 100 ? '' : 'muted'}`}>
      <span></span>
    </button>
    <span className='time-display'>{getTimeString()}</span>
    <input
      className='seek-bar'
      type="range"
      min="0"
      max={duration}
      step=".01"
      value={currentTime}
      onChange={(e) => onSeek(+e.target.value)}
    ></input>
  </div>
}

export default PlayerControl
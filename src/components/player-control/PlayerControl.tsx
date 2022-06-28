import { secondsToHMSString } from "../../utils/moment.util"
import './PlayerControl.css'

interface PlayerControlProps {
  playing: boolean
  currentTime: number
  duration: number

  onPlay: Function
  onPause: Function
  onSeek: Function
}

const PlayerControl = ({
  playing,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeek,
}: PlayerControlProps) => {
  const getTimeString = () => {
    if (duration === 0) return '-:-- / -:--'

    const totalHMS = secondsToHMSString(duration)
    const currentHMS = secondsToHMSString(currentTime, totalHMS.length > '--:--'.length)
    return `${currentHMS} / ${totalHMS}`
  }

  return <div className="player-controls">
    <button onClick={() => playing ? onPause() : onPlay()} className={`button-action ${playing ? 'pause' : ''}`}></button>
    <span className='time-display'>{getTimeString()}</span>
    <input
      className='seek-bar'
      type="range"
      min="0"
      max={duration}
      value={currentTime}
      onChange={(e) => onSeek(+e.target.value)}
    ></input>
  </div>
}

export default PlayerControl
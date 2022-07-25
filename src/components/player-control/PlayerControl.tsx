import { secondsToHMSString } from "../../utils/moment.util"
import styles from './PlayerControl.module.scss'

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
    const currentHMS = secondsToHMSString(currentTime, false, totalHMS.length > '--:--'.length)
    return `${currentHMS} / ${totalHMS}`
  }

  return <div className={styles.playerControls}>
    <button onClick={() => playing ? onPause() : onPlay()} className={`${styles.buttonAction} ${playing ? styles.pause : ''}`} />
    <button onClick={() => volume === 0 ? setVolume(100) : setVolume(0)} className={`${styles.buttonMute} ${volume === 100 ? '' : styles.muted}`}>
      <span></span>
    </button>
    <span className={styles.timeDisplay}>{getTimeString()}</span>
    <input
      className={styles.seekBar}
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
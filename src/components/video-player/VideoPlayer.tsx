import { useEffect, useState } from "react"
import ReactPlayer from "react-player/lazy"
import LoadingIndicator from "../loading-indicator/LoadingIndicator"
import styles from './VideoPlayer.module.scss'
import screenfull from 'screenfull'

interface VideoPlayerProps {
    videoId: string
    playing: boolean
    isFullscreen: boolean
    volume: number

    onPlay: () => void
    onPause: () => void
    onEnded: () => void
    onProgress: (seconds: number) => void
    setDuration: (seconds: number) => void
    setPlayer: (player: ReactPlayer) => void
}

const VideoPlayer = ({
    videoId,
    playing,
    isFullscreen,
    volume,
    onPlay,
    onPause,
    onEnded,
    onProgress,
    setDuration,
    setPlayer,
}: VideoPlayerProps) => {
    const [videoScale, setVideoScale] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    /**
     * Blur iframe every .1s so keyboard events remain on document
     */
    useEffect(() => {
        const blurInterval = setInterval(() => document.getElementsByTagName('iframe')[0]?.blur(), 100)
        return () => clearInterval(blurInterval)
    }, [])

    useEffect(() => {
        setLoading(true)
    }, [videoId])

    useEffect(() => {
        if (!loading && isFullscreen) {
            screenfull.request(document.getElementsByTagName('iframe')[0])
        } else {
            screenfull.exit()
        }
    }, [isFullscreen, loading])

    const handleResize = () => {
        const maxVideoHeight = 289
        const maxVideoWidth = maxVideoHeight * 16 / 9
        const parentWidth = document.getElementById(styles.videoWrapper)?.clientWidth || 0

        if (parentWidth > maxVideoWidth) {
            const scale = parentWidth / maxVideoWidth
            setVideoScale(scale)
        } else {
            setVideoScale(1)
        }
    }

    const handleReady = (player: ReactPlayer): void => {
        setPlayer(player)
        setLoading(false)
    }

    return <>
        <div id={styles.videoWrapper} style={{
            borderRadius: `${(window.innerWidth || 0) > 720 ? 5 * videoScale : 0}px`,
        }}>
            <div className={styles.videoScalingContainer} style={{
                transform: `scale(${videoScale})`,
            }}>
                {loading && <div className={styles.loadingIndicator}><LoadingIndicator /></div>}

                <div className={`${styles.playerContainer} ${loading ? '' : styles.visible}`}>
                    <ReactPlayer
                        height='100%'
                        width='100%'
                        url={`https://www.youtube.com/embed/${videoId}`}
                        progressInterval={1000 / 120}
                        playing={playing}
                        volume={volume}
                        config={{
                            youtube: {
                                playerVars: {
                                    autoplay: 0,
                                    cc_load_policy: 0,
                                    controls: 0,
                                    disablekb: 1,
                                    enablejsapi: 1,
                                    fs: 0,
                                    iv_load_policy: 3,
                                    loop: 0,
                                    modestbranding: 1,
                                    playsinline: 1,
                                    rel: 0,
                                },
                                embedOptions: {},
                            },
                        }}
                        onPlay={onPlay}
                        onPause={onPause}
                        onProgress={({ playedSeconds }) => onProgress(playedSeconds)}
                        onEnded={onEnded}
                        onDuration={setDuration}
                        onReady={(player) => handleReady(player)}
                    />
                </div>
            </div>
        </div>
    </>
}

export default VideoPlayer
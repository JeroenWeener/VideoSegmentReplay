import { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player/lazy"
import './VideoPlayer.css'

interface VideoPlayerProps {
    videoId: string
    playing: boolean

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

    onPlay,
    onPause,
    onEnded,
    onProgress,
    setDuration,
    setPlayer,
}: VideoPlayerProps) => {
    const videoWrapperRef = useRef<HTMLDivElement>(null)
    const reactPlayerRef = useRef<ReactPlayer>(null)

    const [videoScale, setVideoScale] = useState<number>(1)

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

    const handleResize = () => {
        const maxVideoHeight = 289
        const maxVideoWidth = maxVideoHeight * 16 / 9
        const parentWidth = videoWrapperRef.current?.clientWidth || 0
        if (parentWidth > maxVideoWidth) {
            const scale = parentWidth / maxVideoWidth
            setVideoScale(scale)
        } else {
            setVideoScale(1)
        }
    }

    return <div className="video-wrapper" ref={videoWrapperRef} style={{
        borderRadius: `${(window.innerWidth || 0) > 720 ? 30 * videoScale : 0}px`,
    }}>
        <div className="video-scaling-container" style={{
            transform: `scale(${videoScale})`,
        }}>
            <ReactPlayer
                ref={reactPlayerRef}
                height='100%'
                width='100%'
                url={`https://www.youtube.com/embed/${videoId}`}
                progressInterval={1000 / 120}
                playing={playing}
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
                onReady={setPlayer}
            />
        </div>
    </div>
}

export default VideoPlayer
import YouTube, { YouTubeProps } from "react-youtube"
import './VideoPlayer.css'

interface VideoPlayerProps {
    videoId: string
    playing: boolean
    ended: boolean

    onReady: Function
    onPlay: Function
    onPause: Function
    onEnd: Function
}

const VideoPlayer = ({
    videoId,
    playing,
    ended,
    onReady,
    onPlay,
    onPause,
    onEnd,
}: VideoPlayerProps) => {
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
            rel: 1,
        },
    }

    return <div className='video-player-wrapper'>
        <YouTube
            onReady={(e) => onReady(e)}
            onEnd={(e) => onEnd(e)}
            videoId={videoId}
            opts={opts}
        />
        <div
            className={`
             video-player-cover
             ${playing ? '' : 'paused'}
             ${ended ? 'ended' : ''}
           `}
            onClick={() => playing ? onPause() : onPlay()}
        ></div>
    </div>
}

export default VideoPlayer
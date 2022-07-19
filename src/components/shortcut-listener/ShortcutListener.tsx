/**
 * ShortcutListener component.
 * 
 * Pure logic component listening to keyboard events.
 */

import { useEffect } from "react"

interface ShortcutListenerProps {
    onMute: () => void
    onToggle: () => void
    onSeekRelative: (seconds: number) => void
    onFullscreen: () => void
}

const ShortcutListener = ({
    onMute,
    onToggle,
    onSeekRelative,
    onFullscreen,
}: ShortcutListenerProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (
                e.key === 'ArrowLeft' ||
                e.code === 'ArrowLeft' ||
                e.keyCode === 37
            ) {
                e.preventDefault()
                onSeekRelative(-5)
            }

            if (
                e.key === 'ArrowRight' ||
                e.code === 'ArrowRight' ||
                e.keyCode === 39
            ) {
                e.preventDefault()
                onSeekRelative(5)
            }

            if (
                e.key === 'j' ||
                e.code === 'KeyJ' ||
                e.keyCode === 74
            ) {
                e.preventDefault()
                onSeekRelative(-10)
            }

            if (
                e.key === 'l' ||
                e.code === 'KeyL' ||
                e.keyCode === 76
            ) {
                e.preventDefault()
                onSeekRelative(10)
            }
        }
        
        const handleKeyUp = (e: KeyboardEvent): void => {
            if (
                e.key === ' ' ||
                e.code === 'Space' ||
                e.keyCode === 32
            ) {
                e.preventDefault()
                onToggle()
            }

            if (
                e.key === 'k' ||
                e.code === 'KeyK' ||
                e.keyCode === 75
            ) {
                e.preventDefault()
                onToggle()
            }

            if (
                e.key === 'm' ||
                e.code === 'KeyM' ||
                e.keyCode === 77
            ) {
                e.preventDefault()
                onMute()
            }

            if (
                e.key === 'f' ||
                e.code === 'KeyF' ||
                e.keyCode === 77
            ) {
                e.preventDefault()
                onFullscreen()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [onMute, onSeekRelative, onToggle, onFullscreen])

    return <></>
}

export default ShortcutListener
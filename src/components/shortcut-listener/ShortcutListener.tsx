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
}

const ShortcutListener = ({
    onMute,
    onToggle,
    onSeekRelative,
}: ShortcutListenerProps) => {
    useEffect(() => {
        const handleKeydown = (e: any): void => {
            if (
                e.key === ' ' ||
                e.code === 'Space' ||
                e.keyCode === 32
            ) {
                e.preventDefault()
                onToggle()
            }

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
        }
        document.body.addEventListener('keydown', handleKeydown)
        return () => document.body.removeEventListener('keydown', handleKeydown)
    }, [onMute, onSeekRelative, onToggle])

    return <></>
}

export default ShortcutListener
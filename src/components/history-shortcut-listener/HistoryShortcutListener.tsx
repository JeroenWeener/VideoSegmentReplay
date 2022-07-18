import { useEffect } from "react"

interface HistoryShortcutListenerProps {
    onUndo: () => void
    onRedo: () => void
    onUndoReleased: () => void
    onRedoReleased: () => void
}

const HistoryShortcutListener = ({
    onUndo,
    onRedo,
    onUndoReleased,
    onRedoReleased,
}: HistoryShortcutListenerProps) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'z' || e.code === 'KeyZ' || e.keyCode === 90) && e.ctrlKey) {
                e.shiftKey ? onRedo() : onUndo()
            }

            if ((e.key === 'y' || e.code === 'KeyY' || e.keyCode === 89) && e.ctrlKey) {
                onRedo()
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if ((e.key === 'z' || e.code === 'KeyZ' || e.keyCode === 90) && e.ctrlKey) {
                e.shiftKey ? onRedoReleased() : onUndoReleased()
            }

            if ((e.key === 'y' || e.code === 'KeyY' || e.keyCode === 89) && e.ctrlKey) {
                onRedoReleased()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [onUndo, onRedo, onUndoReleased, onRedoReleased])

    return <></>
}

export default HistoryShortcutListener
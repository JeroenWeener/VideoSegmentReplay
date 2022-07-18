import { useEffect } from "react"

interface HistoryShortcutListenerProps {
    onUndo: () => void
    onRedo: () => void
}

const HistoryShortcutListener = ({
    onUndo,
    onRedo,
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

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onUndo, onRedo])

    return <></>
}

export default HistoryShortcutListener
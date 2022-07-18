import { useEffect } from "react"

interface EditModeShortcutListenerProps {
    onToggleEditModePressed: () => void
    onToggleEditMode: () => void
}

const EditModeShortcutListener = ({
    onToggleEditModePressed,
    onToggleEditMode,
}: EditModeShortcutListenerProps) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'e' || e.code === 'KeyE' || e.keyCode === 69) && e.shiftKey) {
                onToggleEditModePressed()
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if ((e.key === 'e' || e.code === 'KeyE' || e.keyCode === 69) && e.shiftKey) {
                onToggleEditMode()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [onToggleEditModePressed, onToggleEditMode])

    return <></>
}

export default EditModeShortcutListener
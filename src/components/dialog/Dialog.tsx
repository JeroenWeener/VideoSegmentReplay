import { useEffect } from 'react'
import './Dialog.css'

interface DialogProps {
    children: React.ReactNode,
    onClose: () => void,
}

const Dialog = ({
    children,
    onClose,
}: DialogProps) => {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const dialog = document.getElementById('dialog')
            const backdrop = document.getElementById('dialog-backdrop')
            if (backdrop?.contains(e.target as Node) && !dialog?.contains(e.target as Node)) {
                onClose()
            }
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (
                e.key === 'Escape' ||
                e.code === 'Escape' ||
                e.keyCode === 27
            ) {
                onClose()
            }
        }

        window.addEventListener('click', handleClickOutside)
        window.addEventListener('keyup', handleEsc)

        return () => {
            window.removeEventListener('click', handleClickOutside)
            window.removeEventListener('keyup', handleEsc)
        }
    }, [onClose])

    return <>
        <div id="dialog-backdrop">
            <div id="dialog">
                {children}
            </div>
        </div>
    </>
}

export default Dialog
import { useEffect } from 'react'
import styles from './Dialog.module.scss'

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
            const dialog = document.getElementById(styles.dialog)
            const backdrop = document.getElementById(styles.backdrop)
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
        <div id={styles.backdrop}>
            <div id={styles.dialog}>
                {children}
            </div>
        </div>
    </>
}

export default Dialog
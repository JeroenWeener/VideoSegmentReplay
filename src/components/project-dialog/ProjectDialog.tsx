import { FormEvent, useState } from "react"
import { extractVideoIdFromYouTubeUrl, isValidYouTubeUrl } from "../../utils/regex.util"
import Dialog from "../dialog/Dialog"

interface ProjectDialogProps {
    onCreate: (projectName: string, videoId: string) => void
    onClose: () => void
}

const ProjectDialog = ({
    onCreate,
    onClose,
}: ProjectDialogProps) => {
    const [projectName, setProjectName] = useState<string>('')
    const [youtubeUrl, setYoutubeUrl] = useState<string>('')

    const handleOnSubmit = (event: FormEvent) => {
        event.preventDefault()
        const videoId = extractVideoIdFromYouTubeUrl(youtubeUrl)

        if (projectName && videoId) {
            onCreate(projectName, videoId)
        }
    }

    return <Dialog onClose={onClose}>
        <form onSubmit={handleOnSubmit}>
            <label>
                Project name
                <input autoFocus type='text' value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </label>
            <br />
            <label>
                Youtube URL
                <input type='text' value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
            </label>
            <br />
            <input type='submit' value='Submit' disabled={projectName.length === 0 || !isValidYouTubeUrl(youtubeUrl)} />
        </form>
    </Dialog>
}

export default ProjectDialog
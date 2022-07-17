import { FormEvent, useState } from "react"
import { projectIdeas } from "../../utils/project.util"
import { getRandom } from "../../utils/random.util"
import { extractVideoIdFromYouTubeUrl, isValidYouTubeUrl } from "../../utils/regex.util"
import Dialog from "../dialog/Dialog"
import './ProjectDialog.css'

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
    const [projectIdea] = useState<{name: string, videoUrl: string}>(getRandom(projectIdeas))

    const handleOnSubmit = (event: FormEvent) => {
        event.preventDefault()
        const videoId = extractVideoIdFromYouTubeUrl(youtubeUrl)

        if (projectName && videoId) {
            onCreate(projectName, videoId)
        }
    }

    return <Dialog onClose={onClose}>
        <h2>New project</h2>
        
        <form className='project-dialog-form' onSubmit={handleOnSubmit}>
            <div>
                <label htmlFor='project-name'>Project name</label>
                <input
                    id='project-name'
                    autoFocus type='text'
                    value={projectName}
                    placeholder={projectIdea.name}
                    onChange={(e) => setProjectName(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor='video-url'>Youtube URL</label>
                <input
                    id='video-url'
                    type='text'
                    value={youtubeUrl}
                    placeholder={projectIdea.videoUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                />
            </div>

            <input type='submit' value='Submit' disabled={projectName.length === 0 || !isValidYouTubeUrl(youtubeUrl)} />
        </form>
    </Dialog>
}

export default ProjectDialog
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectToBase64 } from '../../utils/project.util'
import { extractVideoIdFromYouTubeUrl, isValidYouTubeUrl } from '../../utils/regex.util'

const NewProject = () => {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState<string>('')
  const [youtubeUrl, setYoutubeUrl] = useState<string>('')

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault()
    const videoId = extractVideoIdFromYouTubeUrl(youtubeUrl)

    if (projectName && videoId) {
      navigate(`../project/${projectToBase64({ name: projectName, videoId: videoId, moments: [] })}`)
    }
  }

  return <>
    <form onSubmit={handleOnSubmit}>
      <label>
        Project name
        <input type='text' value={projectName} onChange={(e) => setProjectName(e.target.value)} />
      </label>
      <br />
      <label>
        Youtube URL
        <input type='text' value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
      </label>
      <br />
      <input type='submit' value='Submit' disabled={projectName.length === 0 || !isValidYouTubeUrl(youtubeUrl)} />
    </form>
  </>
}

export default NewProject


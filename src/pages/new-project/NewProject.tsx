import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NewProject = () => {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate(`../projects/${projectName}/${JSON.stringify({ url: youtubeUrl, moments: [] })}`)

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
      <input type='submit' value='Submit' />
    </form>
  </>
}

export default NewProject


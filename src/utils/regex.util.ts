export const isValidYouTubeUrl = (url: string): boolean => {
    return /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/.test(url)
}

export const extractVideoIdFromYouTubeUrl = (url: string): string | null => {
    return url.match(/^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/)?.at(1) || null
}

export const isValidVideoId = (videoId: string): boolean => {
    return /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/.test(videoId)
}

export const isSingleAlphanumericChar = (s: string): boolean => {
    return /^[0-9a-z]$/.test(s)
}
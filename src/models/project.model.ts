import { Moment } from "./moment.model"

export interface Project {
    id: number
    name: string
    videoId: string
    moments: Moment[]
}
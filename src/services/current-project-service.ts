import { Project } from "../models/project.model"

class CurrentProjectService {
    private static instance: CurrentProjectService | null = null
    
    private constructor() {}
    
    static getInstance(): CurrentProjectService {
        if (!this.instance) {
            this.instance = new CurrentProjectService()
        }
        return this.instance
    }


    private currentProject: Project | null = null

    getCurrentProject(): Project | null {
        return this.currentProject
    }

    setCurrentProject(project: Project | null): void {
        this.currentProject = project
    }
}

export default CurrentProjectService
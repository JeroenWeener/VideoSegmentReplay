import _ from 'lodash'
import { useState } from 'react'
import { Moment } from '../../models/moment.model'
import MomentPanel from '../moment-panel/MomentPanel'
import NewMomentPanel from '../new-moment-panel/NewMomentPanel'
import './MomentPanelContainer.css'

interface MomentPanelContainerProps {
    playing: boolean
    moments: Moment[]
    currentTime: number
    onUpdateMoments: (moments: Moment[]) => void
    onSeekTo: (seconds: number) => void
}

const MomentPanelContainer = ({
    playing,
    moments,
    currentTime,
    onUpdateMoments,
    onSeekTo,
}: MomentPanelContainerProps) => {
    const [activeMomentIndex, setActiveMomentIndex] = useState<number | null>(null)

    if (activeMomentIndex) {
        const activeMoment = moments[activeMomentIndex]
        if (currentTime < activeMoment?.startTime) {
            setActiveMomentIndex(null)
        }
    }

    /**
     * Creates a Moment at the current time.
     * The current time will be rounded to 1 decimal.
     */
    const createMoment = () => {
        const startTime = Math.round(currentTime * 10) / 10
        const updatedMoments = [...moments, { startTime: startTime }]
        onUpdateMoments(updatedMoments)
    }

    const deleteMoment = (momentIndex: number) => {
        const updatedMoments = moments.filter((_, i) => i !== momentIndex)
        if (momentIndex === activeMomentIndex) {
            setActiveMomentIndex(null)
        }
        onUpdateMoments(updatedMoments)
    }

    const activateMoment = (moment: Moment, index?: number) => {
        if (index === undefined) {
            index = moments.findIndex(m => _.isEqual(m, moment))
        }
        if (index !== -1) {
            setActiveMomentIndex(index)
            onSeekTo(moment.startTime)
        }
    }

    const updateMoment = (oldMoment: Moment, updatedMoment: Moment): void => {
        const updatedMoments = moments.map((m) => {
            // Replace old moment
            if (_.isEqual(m, oldMoment)) {
                return updatedMoment
            }

            // Remove triggers from other moments that are under the same key
            if (m.trigger && m.trigger === updatedMoment.trigger) {
                return (({ trigger, ...m }) => m)(m)
            }

            return m
        })

        onUpdateMoments(updatedMoments)
    }

    return <div className='panel-container'>
        {moments.map((moment: Moment, index: number) =>
            <MomentPanel
                key={index}
                moment={moment}
                active={index === activeMomentIndex}
                playing={playing}
                onStart={() => activateMoment(moment, index)}
                onDelete={() => deleteMoment(index)}
                onUpdate={(updatedMoment) => updateMoment(moment, updatedMoment)}
            />
        )}

        <NewMomentPanel onClick={createMoment} />
    </div>
}

export default MomentPanelContainer
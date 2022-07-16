import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Moment } from '../../models/moment.model'
import MomentPanel from '../moment-panel/MomentPanel'
import NewMomentPanel from '../new-moment-panel/NewMomentPanel'
import './MomentPanelContainer.css'

interface MomentPanelContainerProps {
    playing: boolean
    moments: Moment[]
    updateMoments: (moments: Moment[]) => void
    currentTime: number
    seekTo: (seconds: number) => void
}

const MomentPanelContainer = ({
    playing,
    moments,
    updateMoments,
    currentTime,
    seekTo,
}: MomentPanelContainerProps) => {
    const [activeMomentIndex, setActiveMomentIndex] = useState<number | null>(null)

    useEffect(() => {
        if (activeMomentIndex) {
            const activeMoment = moments[activeMomentIndex]
            if (currentTime < activeMoment.startTime) {
                setActiveMomentIndex(null)
            }
        }
    }, [activeMomentIndex, currentTime, moments])

    /**
     * Creates a Moment at the current time.
     * The current time will be rounded to 1 decimal.
     */
    const createMoment = () => {
        const startTime = Math.round(currentTime * 10) / 10
        const updatedMoments = [...moments, { startTime: startTime }]
        updateMoments(updatedMoments)
    }

    const deleteMoment = (momentIndex: number) => {
        const updatedMoments = moments.filter((_, i) => i !== momentIndex)
        if (momentIndex === activeMomentIndex) {
            setActiveMomentIndex(null)
        }
        updateMoments(updatedMoments)
    }

    const activateMoment = (moment: Moment, index?: number) => {
        if (index === undefined) {
            index = moments.findIndex(m => _.isEqual(m, moment))
        }
        setActiveMomentIndex(index)
        seekTo(moment.startTime)
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

        updateMoments(updatedMoments)
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

        {moments.length === 0 &&
            <div style={{ visibility: 'hidden' }}><NewMomentPanel /></div>
        }
    </div>
}

export default MomentPanelContainer
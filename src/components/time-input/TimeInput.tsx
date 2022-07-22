import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { secondsToHMSString } from "../../utils/moment.util";

interface TimeInputProps {
    initialSeconds: number
    onSecondsUpdated: (seconds: number) => void
}

const TimeInput = ({
    initialSeconds,
    onSecondsUpdated,
}: TimeInputProps) => {
    const [value, setValue] = useState<string>(secondsToHMSString(initialSeconds))

    useEffect(() => {
        onSecondsUpdated(getSecondsFromHHMMSS(value))
    }, [onSecondsUpdated, value])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const onBlur = (e: FocusEvent<HTMLInputElement>) => {
        const value = e.target.value
        const seconds = Math.max(0, getSecondsFromHHMMSS(value))

        const time = secondsToHMSString(seconds)
        setValue(time)
    }

    return (
        <input
            type="text"
            onChange={(e) => onChange(e)}
            onBlur={(e) => onBlur(e)}
            value={value}
        />
    )
}

const getSecondsFromHHMMSS = (value: string): number => {
    const [str1, str2, str3] = value.split(":");

    const val1 = Number(str1);
    const val2 = Number(str2);
    const val3 = Number(str3);

    if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
        return val1;
    }

    if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
        return val1 * 60 + val2;
    }

    if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
        return val1 * 60 * 60 + val2 * 60 + val3;
    }

    return 0;
};

export default TimeInput
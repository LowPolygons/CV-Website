export function formattedTime(mins: number, secs: number, millis: number) {
    let minsString: String = mins.toString().slice(0, 2);
    let secsString: String = secs.toString().slice(0, 2);
    let millisString: String = millis.toString().slice(0, 3);

    if (minsString.length < 2)
        minsString = "0" + minsString

    if (secsString.length < 2)
        secsString = "0" + secsString

    if (millisString.length < 3)
        millisString= "0".repeat((3 - millisString.length)) + millisString 

    return minsString + ":" + secsString + "." + millisString
}
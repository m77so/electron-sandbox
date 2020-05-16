import React, { useRef, useEffect } from "react";
import { PlayingStateActionType, PlayingStateActions } from '../reducers/playingStatus'

export type TwitterPlayingStatus = { paused: boolean, position: number, duration: number, isPlayEnd: boolean }
const TwitterIFrame: React.FC<{ twid: string, psDispatch: React.Dispatch<PlayingStateActions> }> = ({ twid, psDispatch }) => {
    const iframeEl = useRef<HTMLIFrameElement | null>(null)
    const location = `https://twitter.com/i/videos/tweet/${twid}?autoplay=1`
    useEffect(() => {
        const intervalId = setInterval(() => {
            const elm = iframeEl.current.contentWindow.document.querySelector('#video > div > div:nth-child(2) > span:nth-child(1) > div > div > span:nth-child(2)')
            if(elm === null) return
            const txt = elm.innerHTML
            const strToTime = (val: string) => {
                const part = val.split(':').reverse().map(v => parseInt(v, 10))
                let res = part[0]
                if (part.length >= 2) res += part[1] * 60
                if (part.length >= 3) res += part[2] * 60 * 60
                return res
            }
            const [pos, dur] = txt.split('/').map(v=>v.trim())
            const playbutton = iframeEl.current.contentWindow.document.querySelector('#video > div > div:nth-child(2) > span:nth-child(1) > div > div > div > span > span > button');
            psDispatch({
                type: PlayingStateActionType.SET_TWITTER_OBJECT,
                payload: {
                    paused: playbutton.getAttribute('data-testid') === 'play' || playbutton.getAttribute('data-testid') === 'replay',
                    position: strToTime(pos) * 1000,
                    duration: strToTime(dur) * 1000,
                    isPlayEnd: pos === dur
                }
            })
        }, 250)
        return () => { clearInterval(intervalId) }
    }, [twid])
    return (
        <div><iframe ref={iframeEl} src={location} width="100%" height="500" scrolling="no" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>
        </div>
    )

}

export default TwitterIFrame
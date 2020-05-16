import React, { useRef, useEffect } from "react";
import { PlayingStateActionType, PlayingStateActions } from '../reducers/playingStatus'

export type BilibiliPlayingStatus = { paused: boolean, position: number, duration: number, isPlayEnd: boolean }
const BilibiliIFrame: React.FC<{ bvid: string, psDispatch: React.Dispatch<PlayingStateActions> }> = ({ bvid, psDispatch }) => {
    const iframeEl = useRef<HTMLIFrameElement | null>(null)
    const location = `//player.bilibili.com/player.html?bvid=${bvid}&page=1&danmaku=0&autoplay=1`

    useEffect(() => {
        const intervalId = setInterval(() => {
            const pos = iframeEl.current.contentWindow.document.querySelector('#bofqi > div.bilibili-player-area > div.bilibili-player-video-control > div.bilibili-player-video-time > div > span.bilibili-player-video-time-now').innerHTML
            const dur = iframeEl.current.contentWindow.document.querySelector('#bofqi > div.bilibili-player-area > div.bilibili-player-video-control > div.bilibili-player-video-time > div > span.bilibili-player-video-time-total').innerHTML
            const strToTime = (val: string) => {
                const part = val.split(':').reverse().map(v => parseInt(v, 10))
                let res = part[0]
                if (part.length >= 2) res += part[1] * 60
                if (part.length >= 3) res += part[2] * 60 * 60
                return res
            }

            const playbutton = iframeEl.current.contentWindow.document.querySelector('#bofqi > div.bilibili-player-area > div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-start');
            if (strToTime(dur) === 0) return
            psDispatch({
                type: PlayingStateActionType.SET_BILIBILI_OBJECT,
                payload: {
                    paused: playbutton.classList.contains('video-state-pause'),
                    position: strToTime(pos) * 1000,
                    duration: strToTime(dur) * 1000,
                    isPlayEnd: pos === dur
                }
            })

        }, 250)
        return () => { clearInterval(intervalId) }
    }, [bvid])
    return (
        <div><iframe ref={iframeEl} src={location} width="100%" height="500" scrolling="no" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>
        </div>
    )

}

export default BilibiliIFrame
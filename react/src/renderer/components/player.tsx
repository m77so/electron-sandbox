import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import SpotifyRawAPI from '../api/spotify'
import BilibiliRawAPI from '../api/bilibili'
import SpotifyWebApi from 'spotify-web-api-js'
import { default as playingStatusReducer, initialState, PlayingStateActionType, MusicSource } from '../reducers/playingStatus'
import SpotifyBrowser from './spotifyBrowser'
import PlayingQueue from './playingQueue'
import { default as BilibiliIFrame, BilibiliPlayingStatus } from './bilibiliIFrame'
const Player: React.FC<{ spotifyToken: string }> = ({ spotifyToken }) => {
    const [spotifyPlayer, setPlayer] = useState<Spotify.SpotifyPlayer | null>(null)
    const [spotifyDeviceId, setSpotifyDeviceId] = useState<string | null>(null)
    const [webPlaybackState, setWebPlaybackState] = useState<Spotify.PlaybackState | null>(null)
    const [spotifyApi, setSpotifyApi] = useState<SpotifyWebApi.SpotifyWebApiJs | null>(null)
    const [playingState, psDispatch] = useReducer(playingStatusReducer, initialState)
    useEffect(() => {
        if (spotifyToken === undefined) return;
        const p = new Spotify.Player({
            name: 'Mu Player',
            getOAuthToken: cb => { cb(spotifyToken); }
        })
        const s = new SpotifyWebApi()
        s.setAccessToken(spotifyToken)
        setSpotifyApi(s)
        p.on('ready', async ({ device_id }) => {
            setSpotifyDeviceId(device_id)
            await SpotifyRawAPI.activate(spotifyToken, device_id)
        })
        p.on('player_state_changed', (obj) => {
            setWebPlaybackState(obj)
            psDispatch({ type: PlayingStateActionType.SET_SPOTIFY_OBJECT, payload: obj })
        })
        p.connect()
        setPlayer(p)

        return () => {
            p.disconnect()
            setPlayer(null)
            setSpotifyDeviceId(null)
            setSpotifyApi(null)
        }
    }, [spotifyToken])

    useEffect(() => {
        const f = () => {
            if (playingState.source === 'spotify')
                psDispatch({ type: PlayingStateActionType.ADD_POSITION, milliseconds: 250, add_if_paused: false })
            if (playingState.current_track.start_ready_for_next_track === false &&
                playingState.is_obey_spotify_queue === false &&
                playingState.queue.length > 0 &&
                playingState.current_track.duration - playingState.current_track.position < 800) {
                psDispatch({ type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: true })
                if (playingState.queue[0].source === 'spotify') {
                    ; (async () => {
                        await spotifyApi.play({
                            position_ms: 0,
                            uris: [playingState.queue[0].path],
                        })
                        psDispatch({ type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: false })
                        psDispatch({ type: PlayingStateActionType.POP_QUEUE_AND_INSERT })
                    })()
                } else if (playingState.queue[0].source === 'bilibili') {
                    psDispatch({ type: PlayingStateActionType.POP_QUEUE_AND_INSERT })
                }
            }

        }
        const intervalId = setInterval(f, 250)
        f()

        return () => { clearInterval(intervalId) }
    }, [playingState, spotifyApi])


    const onPause = async (e) => {
        switch (playingState.source) {
            case MusicSource.SPOTIFY:
                await spotifyPlayer.togglePlay()
                break
        }
    }
    const onChangePosition = async (e: React.ChangeEvent<HTMLInputElement>) => {

        psDispatch({ type: PlayingStateActionType.SET_POSITION, milliseconds: +e.target.value })
        await spotifyPlayer.seek(+e.target.value)
    }
    const [biliSearchBoxText, setBiliSearchBoxText] = useState<string>('')
    const onBiliSearchBoxChange = (e: React.FormEvent<HTMLInputElement>) => {
        setBiliSearchBoxText(e.currentTarget.value)
    }
    const onBiliSearchBoxKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            (async () => {
                const res = await BilibiliRawAPI.detail(biliSearchBoxText)
                psDispatch({
                    type: PlayingStateActionType.ADD_TO_QUEUE, track: {

                        artists: [],
                        album: null,
                        title: res.parsedBody.data.View.title,
                        source: MusicSource.BILIBILI,
                        path: biliSearchBoxText,

                    }
                })
            })()
        }
    }
    return (
        <div>
            <input type="range" value={playingState.current_track.position} min="0" max={playingState.current_track.duration} onChange={onChangePosition} />
            {playingState.current_track.title}@{playingState.current_track.position} / {playingState.current_track.duration} <br />
            {playingState.current_track.artists.map(artist => artist.name).join(',')}
            <button onClick={onPause}>{playingState.pause ? '|>' : '||'}</button>
            <div>{playingState.current_track.album !== null ? <img src={playingState.current_track.album.image} /> : null}</div>
            {playingState.source === MusicSource.BILIBILI && playingState.current_track.source === MusicSource.BILIBILI && <BilibiliIFrame bvid={playingState.current_track.path} psDispatch={psDispatch} />}
            <PlayingQueue queue={playingState.queue} psDispatch={psDispatch} />
            <div>BILIBILI BOX: <input type="text" value={biliSearchBoxText} onChange={onBiliSearchBoxChange} onKeyDown={onBiliSearchBoxKeyDown} /></div>
            <SpotifyBrowser spotifyApi={spotifyApi} psDispatch={psDispatch} />
        </div>
    )
}

export default Player
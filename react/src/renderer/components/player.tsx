import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import SpotifyRawAPI from '../api/spotify'
import SpotifyWebApi from 'spotify-web-api-js'
import { default as playingStatusReducer, initialState, PlayingStateActionType } from '../reducers/playingStatus'
import SpotifyBrowser from './spotifyBrowser'

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
        const intervalId = setInterval(() => {
            psDispatch({ type: PlayingStateActionType.ADD_POSITON, milliseconds: 250, add_if_paused: false })

            if (playingState.start_ready_for_next_track === false &&
                playingState.is_obey_spotify_queue === false &&
                playingState.queue.length > 0 &&
                playingState.current_track.duration - playingState.current_track.position < 800) {
                psDispatch({ type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: true })
                if (playingState.queue[0].source === 'spotify') {
                    ; (async () => {
                        await spotifyApi.play({
                            uris: [playingState.queue[0].path]
                        })
                        psDispatch({ type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: false })
                    })()
                }
            }

        }, 250)
        return () => { clearInterval(intervalId) }
    }, [playingState.current_track])

    useEffect(() => {
        const intervalId = setInterval(() => {

        }, 100)
        return () => { clearInterval(intervalId) }
    }, [playingState.current_track])

    const onPause = async (e) => {
        await spotifyPlayer.togglePlay()
    }

    return (
        <div>
            {playingState.current_track.title}@{playingState.current_track.position} / {playingState.current_track.duration} <br />
            {playingState.current_track.artists.map(artist => artist.name).join(',')}
            <button onClick={onPause}>{playingState.pause ? '|>' : '||'}</button>
            <div>{playingState.current_track.album !== null ? <img src={playingState.current_track.album.image} /> : null}</div>
            <SpotifyBrowser spotifyApi={spotifyApi} psDispatch={psDispatch} />
        </div>
    )
}

export default Player
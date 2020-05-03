import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import SpotifyAPI from '../api/spotify'

enum MusicSource{
    SPOTIFY = "spotify"
}
interface Artist{
    name: string,
    image: string | null,
    spotifyUri: string | null,
}
interface Album {
    name: string,
    image: string | null,
    spotifyUri: string | null,
}
interface Song{
    artists: Artist[],
    album: Album | null,
    title: string
}
interface MusicTrack extends Song{
    position: number
    duration: number
}

interface PlayingState {
    source: MusicSource
    pause: boolean
    current_track: MusicTrack
}
enum PlayingStateActionType{
    SET_SPOTIFY_OBJECT,
    ADD_POSITON,
}
type SetSpotifyAction = { type: PlayingStateActionType.SET_SPOTIFY_OBJECT, payload: Spotify.PlaybackState};
type AddPositionAction = {type: PlayingStateActionType.ADD_POSITON, milliseconds: number, add_if_paused: boolean}
const initialState: PlayingState = {
    source: MusicSource.SPOTIFY,
    pause: true,
    current_track: {
        title: '',
        position: -1,
        duration: -1,
        artists: [],
        album: null,
    }
}
const playingStatusReducer = (state: PlayingState, action: SetSpotifyAction | AddPositionAction) => {
    switch (action.type){
        case PlayingStateActionType.SET_SPOTIFY_OBJECT:
            if (state.source !== MusicSource.SPOTIFY) return state
            return {
                ...state,
                pause: action.payload.paused,
                current_track: {
                    title: action.payload.track_window.current_track.name,
                    position: action.payload.position,
                    duration: action.payload.duration,
                    album: {
                        name: action.payload.track_window.current_track.album.name,
                        image: action.payload.track_window.current_track.album.images[0].url || null,
                        spotifyUri: action.payload.track_window.current_track.album.uri
                    },
                    artists: action.payload.track_window.current_track.artists.map(elm=>{
                        return {
                            name: elm.name,
                            spotifyUri: elm.uri,
                            image: null,
                        }
                    })
                }
            }
        case PlayingStateActionType.ADD_POSITON:
            if(action.add_if_paused === false && state.pause) return state
            return {
                ...state,
                current_track: {
                    ...state.current_track,
                    position: state.current_track.position + action.milliseconds
                }
            }
    }
    return state
}
const Player: React.FC<{ spotifyToken: string }> = ({ spotifyToken }) => {
    const [spotifyPlayer, setPlayer] = useState<Spotify.SpotifyPlayer | null>(null)
    const [spotifyDeviceId, setSpotifyDeviceId] = useState<string| null>(null)
    const [webPlaybackState, setWebPlaybackState] = useState<Spotify.PlaybackState | null>(null)
    const [playingState, psDispatch] = useReducer(playingStatusReducer, initialState)

    useEffect(() => {
        if(spotifyToken === undefined) return ;
        const p = new Spotify.Player({
            name: 'Mu Player',
            getOAuthToken: cb => { cb(spotifyToken); }
        })
        p.on('ready', async ({ device_id }) => {
            setSpotifyDeviceId(device_id)
            await SpotifyAPI.activate(spotifyToken, device_id)
        })
        p.on('player_state_changed',(obj) => {
            setWebPlaybackState(obj)
            psDispatch({ type: PlayingStateActionType.SET_SPOTIFY_OBJECT, payload: obj})
        })
        p.connect()
        setPlayer(p)

        return () =>{
            p.disconnect()
            setPlayer(null)
            setSpotifyDeviceId(null)

        }
    }, [spotifyToken])

    useEffect(()=>{
        const intervalId =setInterval(()=>{
            psDispatch({ type: PlayingStateActionType.ADD_POSITON, milliseconds: 250, add_if_paused: false})
        }, 250)
        return ()=>{clearInterval(intervalId)}
    }, [playingState.current_track])

    const onPause = async (e) => {
        await spotifyPlayer.togglePlay()
    }

    return (
    <div>
        {playingState.current_track.title}@{playingState.current_track.position} / {playingState.current_track.duration} <br />
        {playingState.current_track.artists.map(artist =>artist.name).join(',')}
        <button onClick={onPause}>{playingState.pause?'|>':'||'}</button>
        <div>{playingState.current_track.album !== null ? <img src={playingState.current_track.album.image} />:null}</div>
    </div>
    )
}

export default Player
import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import SpotifyRawAPI from '../api/spotify'
import BilibiliRawAPI from '../api/bilibili'
import SpotifyWebApi from 'spotify-web-api-js'
import { default as playingStatusReducer, initialState, PlayingStateActionType, MusicSource, Song } from '../reducers/playingStatus'
import SpotifyBrowser from './spotifyBrowser'
import PlayingQueue from './playingQueue'
import { default as BilibiliIFrame, BilibiliPlayingStatus } from './bilibiliIFrame'
import TwitterIFrame from "./twitterIFrame";
import { remote } from 'electron'
import {writeFileSync, readFileSync} from 'fs'
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
        }
        const intervalId = setInterval(f, 250)
        return () => { clearInterval(intervalId) }
    }, [spotifyApi, playingState.source, playingState.current_track.path])
    useEffect(() => {
        const f = () => {
            if (playingState.source === 'twitter')
                psDispatch({ type: PlayingStateActionType.ADD_POSITION, milliseconds: 1000, add_if_paused: false })
        }
        const intervalId = setInterval(f, 1000)
        return () => { clearInterval(intervalId) }
    }, [playingState.source, playingState.current_track.path])
    const nextTruck = () => {
        psDispatch({ type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: true })
        if (playingState.queue[0].source === 'spotify') {
            ; (async () => {
                await spotifyApi.play({
                    position_ms: 0,
                    uris: [playingState.queue[0].path],
                })
                psDispatch({ type: PlayingStateActionType.POP_QUEUE_AND_INSERT })
            })()
        } else if (['bilibili', 'twitter'].includes(playingState.queue[0].source)) {
            psDispatch({ type: PlayingStateActionType.POP_QUEUE_AND_INSERT })
        }
    }
    useEffect(() => {
        if (playingState.current_track.start_ready_for_next_track === false &&
            playingState.is_obey_spotify_queue === false &&
            playingState.queue.length > 0 &&
            playingState.current_track.duration - playingState.current_track.position < 800) {
            nextTruck()
        }
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
                console.log(/^https:\/\/www.bilibili.com\/video\/(BV[A-Za-z0-9]+)/.exec(biliSearchBoxText))
                const bvid = (/^https:\/\/www.bilibili.com\/video\/(BV[A-Za-z0-9]+)/.exec(biliSearchBoxText)[1]) || biliSearchBoxText
                console.log(bvid)
                const res = await BilibiliRawAPI.detail(bvid)
                psDispatch({
                    type: PlayingStateActionType.ADD_TO_QUEUE, track: {
                        artists: [],
                        album: null,
                        title: res.parsedBody.data.View.title,
                        source: MusicSource.BILIBILI,
                        path: bvid,
                    }
                })
            })()
        }
    }
    const [twitterBoxText, setTwitterBoxText] = useState<string>('')
    const onTwitterhBoxChange = (e: React.FormEvent<HTMLInputElement>) => {
        setTwitterBoxText(e.currentTarget.value)
    }
    const onTwitterBoxKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            (async () => {
                console.log(/^https:\/\/twitter\.com\/[A-Za-z0-9_]+\/status\/([0-9]+)/.exec(twitterBoxText))
                const twid = (/^https:\/\/twitter\.com\/[A-Za-z0-9_]+\/status\/([0-9]+)/.exec(twitterBoxText)[1]) || (/[0-9]{10,40}/.exec(twitterBoxText)[0])
                psDispatch({
                    type: PlayingStateActionType.ADD_TO_QUEUE, track: {
                        artists: [],
                        album: null,
                        title: null,
                        source: MusicSource.TWITTER,
                        path: twid,
                    }
                })
            })()
        }
    }
    const importQueue = () => {
        (async () => {
            const f = await remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Mu Playlist', extensions: ['mu.json'] }]})
            const d = await readFileSync(f.filePaths[0])
            const j: Song[] =(JSON.parse(d.toString()))
            j.forEach(song => {
                psDispatch({ type: PlayingStateActionType.ADD_TO_QUEUE, track: song})
            })
        })()
    }
    const exportPlaylist = () => {
        (async () => {
            const f = await remote.dialog.showSaveDialog({ properties: ['createDirectory'], filters: [{ name: 'Mu Playlist', extensions: ['mu.json'] }] })
            await writeFileSync(f.filePath, JSON.stringify(playingState.queue))
        })()
    }
    return (
        <div>
            <button onClick={importQueue}>Import</button>
            <button onClick={exportPlaylist}>Export</button>
            <button onClick={nextTruck}>Next Truck</button>
            <input type="range" value={playingState.current_track.position} min="0" max={playingState.current_track.duration} onChange={onChangePosition} />
            {playingState.current_track.title}@{playingState.current_track.position} / {playingState.current_track.duration} <br />
            {playingState.current_track.artists.map(artist => artist.name).join(',')}
            <button onClick={onPause}>{playingState.pause ? '|>' : '||'}</button>
            <div>{playingState.current_track.album !== null ? <img src={playingState.current_track.album.image} /> : null}</div>
            {playingState.source === MusicSource.BILIBILI && playingState.current_track.source === MusicSource.BILIBILI && <BilibiliIFrame bvid={playingState.current_track.path} psDispatch={psDispatch} />}
            {playingState.source === MusicSource.TWITTER && playingState.current_track.source === MusicSource.TWITTER && <TwitterIFrame twid={playingState.current_track.path} psDispatch={psDispatch} />}
            <PlayingQueue queue={playingState.queue} psDispatch={psDispatch} />
            <div>BILIBILI BOX: <input type="text" value={biliSearchBoxText} onChange={onBiliSearchBoxChange} onKeyDown={onBiliSearchBoxKeyDown} /></div>
            <div>TWITTER BOX: <input type="text" value={twitterBoxText} onChange={onTwitterhBoxChange} onKeyDown={onTwitterBoxKeyDown} /></div>
            <SpotifyBrowser spotifyApi={spotifyApi} psDispatch={psDispatch} />
        </div>
    )
}

export default Player
import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import SpotifyRawAPI from '../api/spotify'
import SpotifyWebApi from 'spotify-web-api-js'
import {default as SpotifyBrowserLocale, initialState} from '../reducers/spotifyBrowserLocale'
import SpotifySearchResult from './spotifySearchResult'
import {AlbumTracks} from './album'
import {PlayingStateActionType, AddToQueueAction, MusicSource} from '../reducers/playingStatus'

const SpotifyBrowser: React.FC<{ spotifyApi: SpotifyWebApi.SpotifyWebApiJs| null, psDispatch: React.Dispatch<AddToQueueAction> }> = ({ spotifyApi, psDispatch }) => {
    const [searchResult, setSearchResult] = useState<SpotifyApi.SearchResponse| null>(null)
    const [albumTracksResult, setAlbumTracksResult] = useState<SpotifyApi.AlbumTracksResponse| null>(null)
    const [locale, localeDispatch] = useReducer(SpotifyBrowserLocale, initialState)
    const onSearchBoxKeyDown = async(e: React.KeyboardEvent<HTMLInputElement>) =>{
        if (e.keyCode === 13){

            localeDispatch({ type: 'search', q: searchBoxText })
        }
    }
    useEffect(()=>{
        if(!locale.current) return
        switch (locale.current.type){
            case 'search':
                (async()=>{
                    const searchRes = await spotifyApi.search(searchBoxText, ['album','artist','track'])
                    setSearchResult(searchRes)
                })()
                return ()=>{setSearchResult(null)}
            case 'album':
                (async()=>{
                    if (locale.current.type !== 'album') return
                    const albumRes = await spotifyApi.getAlbumTracks(locale.current.id, {market: 'from_token'})
                    setAlbumTracksResult(albumRes)
                })()
                return ()=>{setAlbumTracksResult(null)}
        }
    }, [locale.current])
    const [searchBoxText, setSearchBoxText] = useState<string>('')
    const onSearchBoxChange = (e: React.FormEvent<HTMLInputElement>)=>{
        setSearchBoxText(e.currentTarget.value)
    }
    return (<div>
        <div><input type="text" value={searchBoxText} onChange={onSearchBoxChange} onKeyDown={onSearchBoxKeyDown}/></div>
        {locale.pre.length > 0 &&<button onClick={()=>{localeDispatch({ type: 'backward', num: 1})}}>BACK</button>}
        {locale.next.length > 0 &&<button onClick={()=>{localeDispatch({ type: 'forward', num: 1})}}>NEXT</button>}
        {locale.current && locale.current.type === 'search' && <SpotifySearchResult res={searchResult} dispatch={localeDispatch} />}
        {albumTracksResult && locale.current.type === 'album' && <AlbumTracks albumTracks={albumTracksResult} psDispatch={psDispatch} />}
    </div>)
}

export default SpotifyBrowser
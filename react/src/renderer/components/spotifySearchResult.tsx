import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import SpotifyRawAPI from '../api/spotify'
import SpotifyWebApi from 'spotify-web-api-js'
import {BrowserLocateItem} from '../reducers/spotifyBrowserLocale'

import AlbumSimple from './album'
import ArtistFull from './artist'

const SpotifySearchResult: React.FC<{ res: SpotifyApi.SearchResponse | null, dispatch: React.Dispatch<BrowserLocateItem> }> = ({ res, dispatch }) => {

    // tslint:disable-next-line:no-console
    const onClick = (id:string, type:'album'|'artist'|'track') => {
        dispatch({ type, id })
    }
    return (<div>
        {res !== null && res.artists ? <ul>{res.artists.items.map(artist => <li key={artist.id}><ArtistFull artist={artist} f={onClick} /></li>)}</ul> : null}
        {res !== null && res.albums ? <ul>{res.albums.items.map(album => <li key={album.id}><AlbumSimple album={album} f={onClick} /></li>)}</ul> : null}
    </div>)
}

export default SpotifySearchResult
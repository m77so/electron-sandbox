import React from "react";
import {TrackSimple} from './track'
import {BrowserLocateItem} from '../reducers/spotifyBrowserLocale'
import {PlayingStateActionType, AddToQueueAction, MusicSource} from '../reducers/playingStatus'

const AlbumSimple: React.FC<{ album: SpotifyApi.AlbumObjectSimplified, f: (id: string, type: 'album') => void }> = ({ album, f }) => {

    return (<div onClick={() => { f(album.id, album.type) }}>
        {album.images[0] && <img src={album.images[0].url} width='128' />}
        {album.name} by {album.artists.map(artist => artist.name).join(', ')}
    </div>)
}

export const AlbumTracks: React.FC<{ albumTracks: SpotifyApi.AlbumTracksResponse, psDispatch: React.Dispatch<AddToQueueAction>  }> = ({albumTracks, psDispatch}) => {
    return (<div>
        {albumTracks.items.map(item => <TrackSimple track={item} psDispatch={psDispatch} />)}
    </div>)
}

export default AlbumSimple
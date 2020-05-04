import React from "react";
import {PlayingStateActionType, AddToQueueAction, MusicSource} from '../reducers/playingStatus'

export const TrackSimple: React.FC<{ track: SpotifyApi.TrackObjectSimplified, psDispatch: React.Dispatch<AddToQueueAction>  }> = ({ track, psDispatch}) => {
    return (<div /*onClick={() => { f(track.id, track.type) }}*/>
        {track.is_playable?'✓':'☓'} {track.track_number}: {track.name}  {track.artists.map(artist => artist.name).join(', ')} {track.duration_ms/1000} ms
        <button onClick={
            () => psDispatch({type: PlayingStateActionType.ADD_TO_QUEUE , track:{
            artists: track.artists.map(artist => {return {name: artist.name, image: null, spotifyUri: artist.uri}}),
            album: null, title: track.name, source: MusicSource.SPOTIFY, path: track.uri}
        })}>Add to Queue</button>
    </div>)
}

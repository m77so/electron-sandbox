import { default as playingStatusReducer, Song, PlayingStateActions } from '../reducers/playingStatus'
import React, { useState, useEffect, useReducer } from "react";

const PlayingQueue: React.FC<{ queue: Song[], psDispatch: React.Dispatch<PlayingStateActions> }> = ({ queue, psDispatch }) => {
    return(<div>Queue: {queue.length}
        <ul>
            {queue.map((song)=>{
                return (<li>{song.title} {song.artists.map(artist => artist.name).join(',')}</li>)
            })}
        </ul>
    </div>)
}


export default PlayingQueue
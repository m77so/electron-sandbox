export enum MusicSource{
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
    source: MusicSource,
    path: string
}
interface MusicTrack extends Song{
    position: number
    duration: number
}

interface PlayingState {
    source: MusicSource
    pause: boolean
    current_track: MusicTrack,
    queue: Song[],
    history: Song[],
    is_obey_spotify_queue: boolean,
    start_ready_for_next_track: boolean,
}
export enum PlayingStateActionType{
    SET_SPOTIFY_OBJECT,
    ADD_POSITON,
    ADD_TO_QUEUE,
    POP_QUEUE,
    SET_START_READY_FOR_NEXT_TRACK,
}
type SetSpotifyAction = { type: PlayingStateActionType.SET_SPOTIFY_OBJECT, payload: Spotify.PlaybackState};
type AddPositionAction = {type: PlayingStateActionType.ADD_POSITON, milliseconds: number, add_if_paused: boolean}
export type AddToQueueAction = {type: PlayingStateActionType.ADD_TO_QUEUE, track: Song}
type SetStartReadyForNextTrackAction = {type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: boolean}
type SimpleAction = {type: PlayingStateActionType.POP_QUEUE}
type PlayingStateActions = SetSpotifyAction | AddPositionAction | AddToQueueAction | SetStartReadyForNextTrackAction | SimpleAction
export const initialState: PlayingState = {
    source: MusicSource.SPOTIFY,
    pause: true,
    current_track: {
        title: '',
        position: -1,
        duration: -1,
        artists: [],
        album: null,
        source: MusicSource.SPOTIFY,
        path: null
    },
    queue: [],
    history: [],
    is_obey_spotify_queue: false,
    start_ready_for_next_track: false,
}
const playingStatusReducer = (state: PlayingState, action: PlayingStateActions) => {
    let res = state
    switch (action.type){
        case PlayingStateActionType.SET_SPOTIFY_OBJECT:
            if (state.source !== MusicSource.SPOTIFY) return state
            res = {
                ...res,
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
                    }),
                    source: MusicSource.SPOTIFY,
                    path: action.payload.track_window.current_track.id,
                }
            }
            break
        case PlayingStateActionType.ADD_POSITON:
            if(action.add_if_paused === false && state.pause) return state
            res = {
                ...res,
                current_track: {
                    ...state.current_track,
                    position: state.current_track.position + action.milliseconds
                }
            }
            break
        case PlayingStateActionType.ADD_TO_QUEUE:
            res.queue.push(action.track)
            break
        case PlayingStateActionType.POP_QUEUE:
            res.queue.shift()
            break
        case PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK:
            res.start_ready_for_next_track = action.value
            break
    }
    console.log(res)
    console.log(action)
    if (state.current_track.source !== res.current_track.source || state.current_track.path !== res.current_track.path){
        res.history.push(state.current_track)
    }

    return res
}
export default playingStatusReducer

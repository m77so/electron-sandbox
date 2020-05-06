import { BilibiliPlayingStatus} from '../components/bilibiliIFrame'

export enum MusicSource{
    SPOTIFY = "spotify",
    BILIBILI = "bilibili",
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
export interface Song{
    artists: Artist[],
    album: Album | null,
    title: string
    source: MusicSource,
    path: string
}
interface MusicTrack extends Song{
    position: number
    duration: number
    start_ready_for_next_track: boolean
}

interface PlayingState {
    source: MusicSource| null
    pause: boolean
    current_track: MusicTrack,
    queue: Song[],
    history: Song[],
    is_obey_spotify_queue: boolean,
}
export enum PlayingStateActionType{
    SET_SPOTIFY_OBJECT,
    SET_BILIBILI_OBJECT,
    ADD_POSITION,
    SET_POSITION,
    ADD_TO_QUEUE,
    POP_QUEUE,
    POP_QUEUE_AND_INSERT,
    SET_START_READY_FOR_NEXT_TRACK,
}
type SetSpotifyAction = { type: PlayingStateActionType.SET_SPOTIFY_OBJECT, payload: Spotify.PlaybackState};
type SetBilibiliAction = {type: PlayingStateActionType.SET_BILIBILI_OBJECT, payload: BilibiliPlayingStatus}
type AddPositionAction = {type: PlayingStateActionType.ADD_POSITION, milliseconds: number, add_if_paused: boolean}
type SetPositionAction = {type: PlayingStateActionType.SET_POSITION, milliseconds: number}
export type AddToQueueAction = {type: PlayingStateActionType.ADD_TO_QUEUE, track: Song}
type SetStartReadyForNextTrackAction = {type: PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK, value: boolean}
type SimpleAction = {type: PlayingStateActionType.POP_QUEUE| PlayingStateActionType.POP_QUEUE_AND_INSERT}
export type PlayingStateActions = SetSpotifyAction | SetBilibiliAction| AddPositionAction | AddToQueueAction | SetStartReadyForNextTrackAction | SimpleAction | SetPositionAction
export const initialState: PlayingState = {
    source: null,
    pause: true,
    current_track: {
        title: '',
        position: -1,
        duration: -1,
        artists: [],
        album: null,
        source: null,
        path: null,
        start_ready_for_next_track: false,
    },
    queue: [],
    history: [],
    is_obey_spotify_queue: false,
}
const playingStatusReducer = (state: PlayingState, action: PlayingStateActions) => {
    let res = state
    // tslint:disable-next-line:no-console
    console.log(state, action)
    switch (action.type){
        case PlayingStateActionType.SET_SPOTIFY_OBJECT:
            if (state.source !== MusicSource.SPOTIFY) return state
            res = {
                ...res,
                pause: action.payload.paused,
                current_track: {
                    ...res.current_track,
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
        case PlayingStateActionType.SET_BILIBILI_OBJECT:
            if (state.source !== MusicSource.BILIBILI) return state
            res = {
                ...res,
                current_track:{
                    ...res.current_track,
                    duration: action.payload.duration,
                    position: action.payload.position,
                },
                pause: action.payload.paused
            }
            break
        case PlayingStateActionType.ADD_POSITION:
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
            res = {
                ...res,
                queue: res.queue.concat(action.track)
            }
            break
        case PlayingStateActionType.POP_QUEUE:
            res = {
                ...res,
                queue: res.queue.slice(1),
                history: res.history.concat(state.current_track),
            }
            break
        case PlayingStateActionType.POP_QUEUE_AND_INSERT:
            console.log(res)
            res = {
                ...res,
                history: res.history.concat(state.current_track),
                current_track: {...res.queue[0], duration: 0, position: -999999, start_ready_for_next_track: false},
                source: res.queue[0].source,
            }
            res = {
                ...res,
                queue: res.queue.slice(1),
            }
            break
        case PlayingStateActionType.SET_START_READY_FOR_NEXT_TRACK:
            res = {
                ...res,
                current_track:{
                    ...res.current_track,
                    start_ready_for_next_track: action.value
                }
            }
            break
        case PlayingStateActionType.SET_POSITION:
            res = {
                ...res,
                current_track:{
                    ...res.current_track,
                    position: action.milliseconds
                }
            }
            break
    }
    return res
}
export default playingStatusReducer

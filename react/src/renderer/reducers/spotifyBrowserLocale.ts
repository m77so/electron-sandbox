export interface BrowserLocateItem {
    id: string, type: 'album'|'artist'|'track'
}
interface BrowserLocateSearch {
    type: 'search'
    q: string
}
type BrowserLocate = BrowserLocateItem | BrowserLocateSearch
interface RelativeMove{
    type: 'backward'|'forward'
    num: number
}
interface SpotifyBrowserLocaleState {
    current: BrowserLocate | null
    pre: BrowserLocate[]
    next: BrowserLocate[]
}
export const initialState: SpotifyBrowserLocaleState = {
    current: null,
    pre: [], next: []
}
const spotifyBrowserLocale = (state: SpotifyBrowserLocaleState, action: BrowserLocate| RelativeMove) => {
    switch (action.type) {
        case 'search':
        case 'album':
        case 'artist':
        case 'track':
            return {
                pre: state.pre.concat(state.current),
                current: action,
                next: []
            }
        case 'backward':
            if (state.pre.length === 0) return state
            const bnum = Math.min(action.num, state.pre.length)
            return {
                current: state.pre[state.pre.length - bnum],
                pre: state.pre.slice(0, state.pre.length - bnum),
                next: state.pre.slice(state.pre.length - bnum + 1).concat(state.current).concat(state.next)
            }
        case 'forward':
            if (state.next.length === 0) return state
            const fnum = Math.min(action.num, state.next.length) - 1
            return {
                current: state.next[fnum],
                pre: state.pre.concat(state.current).concat(state.next.slice(0,fnum-1)),
                next: state.next.slice(fnum)
            }
    }
}

export default spotifyBrowserLocale
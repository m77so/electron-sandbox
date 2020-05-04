import querystring from 'querystring';

const SPOTIFY_ENDPOINT = 'https://api.spotify.com'


export default {
    activate: async (token: string, deviceId: string) => {
        return fetch(SPOTIFY_ENDPOINT + '/v1/me/player', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ device_ids: [deviceId] }),
        })
    },
}
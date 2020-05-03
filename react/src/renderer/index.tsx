import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";


import { remote, shell } from 'electron';
import crypto from 'crypto';
import querystring from 'querystring';
import base64url from 'base64-url';
import axios from 'axios';
import credential from './credential'


import Player from './components/player'

ReactDOM.render(
  <App />,
  document.getElementById("app"),
);


const { waitCallback, focusWin } = remote.require('./main')
let loadScriptPromise: Promise<void>

const loadScript = () => {
  const id = 'spotify-playback-sdk'
  if (loadScriptPromise !== void 0) return loadScriptPromise
  loadScriptPromise = new Promise((resolve, reject) =>{
    const scriptTag = document.getElementById(id)
    if (!scriptTag) {
      const script = document.createElement("script");
      script.id    = id
      script.type  = "text/javascript";
      script.src   = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      script.defer = true
      window.onSpotifyWebPlaybackSDKReady = resolve
      document.head.appendChild(script)
    }
  })
  return loadScriptPromise
}

async function startAuth() {
  const authEndpoint = "https://accounts.spotify.com/authorize"
  const tokenEndpointUrl = "https://accounts.spotify.com/api/token"

  const scopes = [
    "streaming",
    "user-read-email",
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state',
  ]
  const redirectUri = 'http://localhost:31930/'
  // code verifier value is generated randomly and base64url-encoded
  const state = base64url.encode(crypto.randomBytes(32))
  const query = querystring.stringify({
    response_type: 'code',
    client_id: credential.clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state,
  })
  const url = `${authEndpoint}?${query}`
  // tslint:disable-next-line:no-console
  console.log(url)
  shell.openExternal(url)
  const {code} = await waitCallback(redirectUri, state)
  const ret = await axios({
    method: 'post',
    url: tokenEndpointUrl,
    headers : {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: credential.clientId,
      client_secret: credential.clientSecret,
      redirect_uri: redirectUri,
    }),
  });
  return ret.data;
}


function App(){
  const [spotifyToken, setSpotifyToken] = useState<string| undefined>();

  const onLoginSpotify = async (e) => {
    await loadScript()
    const t = await startAuth()
    setSpotifyToken(t.access_token)

  }

  return(
    <div>
      <ul>
        <li>
          {spotifyToken === undefined ?
            <button onClick={ onLoginSpotify }>Login to Spotify</button> :
            '✓ Spotify'
          }
        </li>
      </ul>
      <Player spotifyToken={spotifyToken}/>
    </div>
  );
}
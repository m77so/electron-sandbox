import React from "react";


const ArtistFull: React.FC<{ artist: SpotifyApi.ArtistObjectFull , f: (id: string, type: 'artist') => void }> = ({ artist, f }) => {

    return (<div onClick={() => { f(artist.id, artist.type) }}>
        {artist.images[0] && <img src={artist.images[0].url} width='128' />}
        {artist.name}
    </div>)
}

export default ArtistFull
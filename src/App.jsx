import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'



function App() {

const CLIENT_ID = "7369de991218483caedf489144c030aa";
const REDIRECT_URI = "http://localhost:5173/";
const  AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token"

const [token, setToken] = useState("")
const [searchKey, setSearchKey] = useState("")
const [artists,setArtists] = useState([])


useEffect(() => {
const hash = window.location.hash
let token = window.localStorage.getItem("token")

// To gain access to just the token 

if(!token && hash){
  token = hash
  .substring(1)
    .split("&")
    .find(elem => elem.startsWith("access_token"))
    .split("=")[1];

  window.location.hash = ""
  window.localStorage.setItem("token",token)
}
setToken(token)


},[])

const logout = () => {
  setToken("")
  window.localStorage.removeItem("token")
}

const searchArtists = async (e) => {
  e.preventDefault()
  const {data} =  await axios.get("https://api.spotify.com/v1/search",{
    headers:{
      Authorization: `Bearer ${token}`,
    },

    params:{
      q: searchKey,
      type: "artist"
    }
  })

  setArtists(data.artists.items);

}


const showArtist = () => {
  return artists.map( artist =>  (
    <div key={artist.id}>
      {artist.name}
      {artist.images.length ? <img width={"100px"}src={artist.images[0].url} alt=""/> : <b>No images</b>}
    </div>
  ))
}


  return (

    <>
  
  <h1>Spotify Playlist</h1>

  {!token ?
  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
    Login to Spotify
  </a>
  : <button onClick={logout}>Log Out</button>}

    {token ? 
    <form onSubmit={searchArtists}>
      <input type="text" onChange={e => setSearchKey(e.target.value)}/>
      <button type={"submit"}>Search</button>
    </form>
    : <b>Please Login</b>
  }

  {showArtist()}

    </>
  )
}

export default App

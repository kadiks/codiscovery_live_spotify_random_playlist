const express = require("express");
const axios = require("axios");
const _ = require("lodash");
const { clean } = require("../utils/track");

const router = express.Router();

router.get("/random", async (req, res) => {
  console.log("GET /");

  const { access_token } = req.query;

  const rootUrl = "https://api.spotify.com/v1";
  const pathname = "/me/playlists";

  const url = `${rootUrl}${pathname}`;

  console.log("GET / url", url);
  console.log("GET / access_token", access_token);

  const { data } = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  console.log("GET / data", data);

  res.json(data);
});

const getPlaylistTracks = async ({ playlist, access_token } = {}) => {
  const { type, id } = playlist;

  const url = `https://api.spotify.com/v1/${type}/${id}/tracks`;

  const { data } = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  const tracks = data.items
    .map((datum) => {
      // console.log("datum", datum);
      // console.log("datum.track", datum.track);
      // console.log("datum.track.album", datum.track.name);
      // console.log("datum.track.album.name", datum.track.album.name);
      // console.log("Object.keys(datum)", Object.keys(datum));
      const { track } = datum;
      // console.log("Object.keys(track)", Object.keys(track));
      const { id, name, preview_url, popularity } = track;
      // console.log("Object.keys(album)", Object.keys(album));

      const artists = track.artists.map((a) => a.name);

      // const { name, id, release_date } = album;
      const image = _.get(track, "album.images[0].url", null);
      return {
        artists,
        name: clean(name),
        originalName: name,
        id,
        image,
        popularity,
        preview_url,
      };
    })
    .filter((t) => t.popularity >= 60)
    .filter((t) => t.preview_url !== null);

  return tracks;
};

router.get("/", async (req, res) => {
  const { access_token } = req.query;

  // const search = getRandomSearch();
  // const search = `blind%test`;
  const blindTests = [
    // { type: "playlists", id: "4kAqBBEZQsBIXMIJl6u8tO" },
    { type: "playlists", id: "7oBeEkujcRybm7dCAUAIhG" },
    { type: "playlists", id: "2IamgqJjhiz48fBY9W0kpa" },
    { type: "playlists", id: "6J7xdAmvpquhkPG1sxldMp" },
    { type: "playlists", id: "5zITOyhjFoptruddJLJwFU" },
    { type: "playlists", id: "0pDroIJqt63NYXt29OzYlm" },
  ];

  const randIndex = Math.floor(Math.random() * blindTests.length);

  const selected = blindTests[randIndex];

  // const type = "track";

  // const market = "FR";

  // const url = `https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(
  //   search
  // )}&market=${market}`;

  // console.log("access_token", access_token);
  // console.log("access_token", url);

  // console.log("selected", selected);

  // const { type, id } = selected;

  const allTracks = await Promise.all(
    blindTests.map((playlist) => getPlaylistTracks({ playlist, access_token }))
  );
  // getPlaylistTracks({ playlist: selected, access_token });

  // res.json(tracks);
  const tracks = [];
  allTracks.forEach((pTracks) => {
    tracks.push(...pTracks);
  });
  res.json(tracks);
});

module.exports = router;

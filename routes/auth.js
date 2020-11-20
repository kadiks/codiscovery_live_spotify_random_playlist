const express = require("express");
const qs = require("qs");
const axios = require("axios");
const fetch = require("node-fetch");
const querystring = require("querystring");

const {
  PORT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

const router = express.Router();

router.get("/login", (req, res) => {
  const scope =
    "user-read-recently-played user-read-email playlist-read-private";
  const host = "https://accounts.spotify.com/authorize";
  const query = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope,
    show_dialog: true,
    ori_uri: req.query.ori_uri,
  };
  res.redirect(`${host}?${qs.stringify(query)}`);
});

router.get("/logged", async (req, res) => {
  const body = {
    grant_type: "authorization_code",
    code: req.query.code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  };

  const url = `https://accounts.spotify.com/api/token`;

  const { data } = await axios.post(url, querystring.stringify(body));

  console.log("data", data);

  const query = qs.stringify(data);

  const ori_uri = req.query.ori_uri || "";

  res.redirect(`http://localhost:${PORT}/${ori_uri}?${query}`);
});

module.exports = router;

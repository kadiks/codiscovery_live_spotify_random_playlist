require("dotenv").config();

const fs = require("fs-extra");
const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/auth");
const mainRoute = require("./routes/main");

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const checkAccessToken = async (req, res, next) => {
  // console.log("req", Object.keys(req.headers));
  console.log("req", req.headers.referer);
  if (req.query.hasOwnProperty("access_token") === true) {
    await fs.writeFile(
      "cache.json",
      JSON.stringify(req.query, null, 2),
      "utf8"
    );
    next();
    return;
  }
  if (typeof req.headers.headers === "undefined") {
    const query = JSON.parse(await fs.readFile("cache.json"));
    // console.log("query", query);
    res.redirect(`/?access_token=${query.access_token}`);
    return;
  }
  res.redirect(`/auth/login?ori_uri=${req.url}`);
};

app.use("/auth", authRoute);

app.use("/", checkAccessToken, mainRoute);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

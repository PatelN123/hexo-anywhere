const axios = require("axios");
const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/check").checkLogin;

router.get("/", checkLogin, function (req, res, next) {
  //res.send("控制台");
  axios({
    method: "get",
    url: `https://api.github.com/repos/hans362/MyBlog/contents/source/_posts/2017-annual-report.md`,
    headers: {
      Authorization: `token ${process.env.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      //console.log(response.data.content);
      res.render("debug", {
        page: "dash",
        articleList: Buffer.from(response.data.content, "base64").toString(),
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/posts", checkLogin, function (req, res, next) {
  //res.send("控制台");
  axios({
    method: "get",
    url: `https://api.github.com/repos/hans362/MyBlog/contents/source/_posts`,
    headers: {
      Authorization: `token ${process.env.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      //console.log(response.data);
      res.render("dash-posts", {
        page: "dash-posts",
        posts: response.data,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/editor/new", checkLogin, function (req, res, next) {
  res.render("dash-editor", {
    page: "dash-editor",
    content: "",
  });
});

router.get("/editor/:postName", checkLogin, function (req, res, next) {
  const postName = req.params.postName;
  const rawUrl =
    "https://api.github.com/repos/hans362/MyBlog/contents/source/_posts/" +
    postName +
    ".md";
  //console.log(rawUrl);
  axios({
    method: "get",
    url: rawUrl,
    headers: {
      Authorization: `token ${process.env.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      //console.log(response.data);
      res.render("dash-editor", {
        page: "dash-editor",
        name: postName,
        content: Buffer.from(response.data.content, "base64").toString(),
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

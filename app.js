var express = require('express');
const axios = require("axios");
const bluebird = require("bluebird");
const packages = require("./appIds");
const fs = require("fs");
var app = express();

async function pkgRequests(pkgs) {
    var stream = fs.createWriteStream("subIds.txt", { flags: "a" });
    await bluebird.map(
      pkgs,
      async (pkg) => {
        await axios
          .get(
              `https://store.steampowered.com/api/appdetails?appids=${pkg}&filters=packages`
          )
          .then(function (response) {
            fs.appendFile('subIds.txt', response.data[pkg].data.packages[0] + ",", (err) => {
                if (err) throw err;
              });
            console.log(`Package ${pkg} saved. /  Pacote ${pkg} salvo.`);
          });
      },
      { concurrency: 2, timeout: 2000 }
    );
  }

var listener = app.listen(8080, function () {
    console.log('App running on port / App rodando na porta ' + listener.address().port);
})

pkgRequests(packages);
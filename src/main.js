//main.js
const venom = require("venom-bot");
const fs = require("fs");
const { response } = require("./chatgpt");

venom
  .create(
    "sessionName",
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error("Invalid input string");
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], "base64");

      var imageBuffer = response;
      require("fs").writeFile(
        "out.png",
        imageBuffer["data"],
        "binary",
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (
      message.body &&
      message.body.toUpperCase().includes("CHATGPT") &&
      message.isGroupMsg === false &&
      message.from !== "status@broadcast"
    ) {
      response(message.body)
        .then((data) => {
          console.log(data.data.choices[0]);
          client
            .sendText(
              message.from,
              `${"ChatGPT respondendo..." + data.data.choices[0].text}`
            )
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

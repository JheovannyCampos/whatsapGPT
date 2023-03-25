//main.js
const venom = require("venom-bot");
const { response } = require("./chatgpt");

venom
  .create({
    session: "session-name", //name of session
    multidevice: true, // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
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

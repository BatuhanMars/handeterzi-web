// Plesk / Phusion Passenger başlangıç dosyası.
// Passenger bu dosyayı çalıştırır, process.env.PORT ile bir port verir ve
// gelen istekleri bu Node.js sürecine yönlendirir. Next.js'i production
// modunda programatik olarak başlatıyoruz (önce `npm run build` çalışmış olmalı).
const { createServer } = require("node:http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`> handeterzi-web hazır — port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Sunucu başlatılamadı:", err);
    process.exit(1);
  });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const history = require("connect-history-api-fallback");
const path = require("path");
const http = require("http");
const cron = require("node-cron");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// db
const db = require("./models");
// db.sequelize.sync({ force: true });  // DB 테이블 초기화 옵션
db.sequelize.sync();

// heroku deploy일 경우에만 client build 설정
if (process.env.NODE_ENV === "production") {
  app.use(history());
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("/", (req, res) => {
    console.log("==========================>test from app.get!");
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// routes
require("./routes/user.routes")(app);
require("./routes/group.routes")(app);
require("./routes/monitoring.routes")(app);
require("./routes/board.routes")(app);
require("./routes/log.routes")(app);
require("./routes/task.routes")(app);
require("./routes/folder.routes")(app);
require("./routes/schedule.routes")(app);
require("./routes/inbox.routes")(app);
require("./routes/weather.routes")(app);
require("./routes/alarm.routes")(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

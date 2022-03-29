module.exports = (app) => {
  const weathers = require("../controllers/weather.controller");
  var router = require("express").Router();

  router.get("/current", weathers.findCurrentWeathers);
  router.get("/past", weathers.findPastWeathers);

  app.use("/api/weather", router);
};

module.exports = (app) => {
  const cats = require("../controllers/paycat.controller");
  var router = require("express").Router();

  router.post("/", cats.create);
  router.get("/", cats.findAll);
  router.get("/:id", cats.findOne);
  router.put("/:id", cats.update);
  router.delete("/:id", cats.delete);
  router.delete("/", cats.deleteAll);

  app.use("/api/cats", router);
};

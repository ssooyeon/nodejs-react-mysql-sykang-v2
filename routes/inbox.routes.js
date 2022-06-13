module.exports = (app) => {
  const inboxs = require("../controllers/inbox.controller");
  var router = require("express").Router();

  router.post("/", inboxs.create);
  router.get("/", inboxs.findAll);
  router.get("/count/user", inboxs.findIsConfirmedCount);
  router.get("/:id", inboxs.findOne);
  router.put("/:id", inboxs.update);
  router.delete("/:id", inboxs.delete);
  router.delete("/", inboxs.deleteAll);

  app.use("/api/inboxs", router);
};

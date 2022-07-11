module.exports = (app) => {
  const asserts = require("../controllers/payassert.controller");
  var router = require("express").Router();

  router.post("/", asserts.create);
  router.get("/", asserts.findAll);
  router.get("/:id", asserts.findOne);
  router.put("/:id", asserts.update);
  router.delete("/:id", asserts.delete);
  router.delete("/", asserts.deleteAll);

  app.use("/api/asserts", router);
};

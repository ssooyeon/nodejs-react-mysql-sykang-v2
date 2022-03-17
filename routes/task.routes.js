module.exports = (app) => {
  const tasks = require("../controllers/task.controller");
  var router = require("express").Router();

  router.post("/", tasks.create);
  router.get("/", tasks.findAll);
  router.get("/user/:userId", tasks.findAllByUser);
  router.get("/:id", tasks.findOne);
  router.put("/:id", tasks.update);
  router.delete("/:id", tasks.delete);
  router.delete("/", tasks.deleteAll);
  /************************************************************ 통계 */
  router.get("/statistic/duedate", tasks.findAllDueDateByChart);
  router.get("/statistic/duedate/top5", tasks.findTop5DueDate);
  router.get("/statistic/folder", tasks.findAllFolderByChart);
  router.get("/statistic/folder/user", tasks.findAllUserFolderByChart);
  router.get("/statistic/user/top5", tasks.findTop5TaskUser);

  app.use("/api/tasks", router);
};

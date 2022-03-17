const db = require("../models");
const Folder = db.folders;
const Task = db.tasks;
const User = db.users;
const Log = db.logs;
const Op = db.Sequelize.Op;

/**
 * 테스크 생성
 */
exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content cannot be empty." });
    return;
  }
  const task = req.body;
  Task.create(task)
    .then((data) => {
      Log.create({ status: "SUCCESS", message: `Task create successfully. New task title is: ${req.body.title}` });
      res.send(data);
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Task create failed. Task title is: ${req.body.title}` });
      res.status(500).send({ message: err.message || "Some error occurred while creating the Task." });
    });
};

/**
 * 테스크 전체 조회
 */
exports.findAll = (req, res) => {
  Task.findAll({
    include: [
      {
        model: User,
        as: "creater",
      },
    ],
    order: [["ordering", "ASC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving tasks." });
    });
};

// 현재 로그인한 사용자의 오늘 테스크 목록 조회
exports.findAllByUser = (req, res) => {
  const userId = req.params.userId;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todayEnd = new Date().setHours(23, 59, 59, 59);
  Task.findAll({
    include: [
      {
        model: User,
        as: "creater",
      },
    ],
    where: {
      createrId: { [Op.eq]: userId },
      dueDate: {
        [Op.gt]: todayStart,
        [Op.lt]: todayEnd,
      },
    },
    order: [["ordering", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving tasks." });
    });
};

/**
 * 테스크 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Task.findByPk(id, {
    include: [
      {
        model: User,
        as: "creater",
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || `Error retrieving Task with id=${id}` });
    });
};

/**
 * 테스크 수정
 */
exports.update = (req, res) => {
  const id = req.params.id;
  Task.update(req.body, { where: { id: id } })
    .then((num) => {
      Log.create({ status: "SUCCESS", message: `Task update successfully. Task title is: ${req.body.title}` });
      res.send({ message: "Task was updated successfully." });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Task update failed. Task title is: ${req.body.title}` });
      res.status(500).send({ message: err.message || `Error updating Task with id=${id}` });
    });
};

/**
 * 테스크 삭제
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  Task.destroy({ where: { id: id } })
    .then((num) => {
      if (num === 1) {
        Log.create({ status: "SUCCESS", message: `Task delete successfully. New task id is: ${id}` });
        res.send({ message: "Task was deleted successfully." });
      } else {
        res.send({ message: `Cannot delete Task with id=${id}. maybe Task was not found.` });
      }
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Task delete failed. Task id is: ${id}` });
      res.status(500).send({ message: err.message || `Could not delete Task with id=${id}` });
    });
};

/**
 * 테스크 전체 삭제
 */
exports.deleteAll = (req, res) => {
  Task.destroy({ where: {}, truncate: false })
    .then((nums) => {
      Log.create({ status: "SUCCESS", message: "All tasks delete successfully." });
      res.send({ message: `${nums} Tasks were deleted successfully.` });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: "All tasks delete failed" });
      res.status(500).send({ message: err.message || "Some error occurred while deleting all tasks." });
    });
};

/************************************************************ 통계 */
/**
 * 테스크 개수 통계 조회
 */
exports.findAllDueDateByChart = (req, res) => {
  const { category } = req.query;
  if (category === "" || category === undefined) {
    res.status(400).send({ message: "Category (daliy or monthly) cannot be empty." });
    return;
  }

  let format = "%Y-%m";
  let start = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).setHours(0, 0, 0, 0);
  if (category === "date") {
    format = "%Y-%m-%d";
    start = new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0);
  }
  const end = new Date().setHours(23, 59, 59, 59);

  Task.findAll({
    group: [db.Sequelize.fn(category, db.Sequelize.col("dueDate"))],
    attributes: [
      [db.Sequelize.fn("date_format", db.Sequelize.col("dueDate"), format), "name"],
      [db.Sequelize.fn("count", "*"), "count"],
    ],
    order: [["dueDate", "ASC"]],
    where: {
      dueDate: {
        [Op.gt]: start,
        [Op.lt]: end,
      },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving task due date." });
    });
};

/**
 * 테스크 개수 상위 5개 날짜 조회
 */
exports.findTop5DueDate = (req, res) => {
  Task.findAll({
    group: [db.Sequelize.fn("date", db.Sequelize.col("dueDate"))],
    attributes: [
      [db.Sequelize.fn("date_format", db.Sequelize.col("dueDate"), "%Y-%m-%d"), "name"],
      [db.Sequelize.fn("count", "*"), "count"],
    ],
    where: { dueDate: { [Op.ne]: null } },
    order: [[db.Sequelize.literal("count"), "DESC"]],
    limit: 5,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving task due date Top5." });
    });
};

/**
 * 폴더별 테스크 개수 통계 조회
 */
exports.findAllFolderByChart = (req, res) => {
  Task.findAll({
    group: ["folder.parentId"],
    attributes: [
      [db.Sequelize.col("folder.parent.name"), "name"],
      [db.Sequelize.fn("count", "folderId"), "count"],
    ],
    include: [
      {
        model: Folder,
        as: "folder",
        include: [
          {
            model: Folder,
            as: "parent",
            where: { parentId: { [Op.eq]: null } },
          },
        ],
      },
    ],
    order: [[db.Sequelize.literal("count"), "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving task count with folder." });
    });
};

/**
 * 폴더별, 사용자별 테스크 개수 통계 조회
 */
exports.findAllUserFolderByChart = (req, res) => {
  Task.findAll({
    group: ["folder.parentId", "createrId"],
    attributes: ["createrId", [db.Sequelize.col("folder.parent.name"), "name"], [db.Sequelize.fn("count", "id"), "count"]],
    include: [
      {
        model: User,
        as: "creater",
      },
      {
        model: Folder,
        as: "folder",
        include: [
          {
            model: Folder,
            as: "parent",
            where: { parentId: { [Op.eq]: null } },
          },
        ],
      },
    ],
    order: [[db.Sequelize.literal("count"), "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving task count with folder." });
    });
};

// 테스크 개수 최고 사용자 조회
exports.findTop5TaskUser = (req, res) => {
  Task.findAll({
    group: ["createrId"],
    attributes: [
      [db.Sequelize.col("creater.account"), "name"],
      [db.Sequelize.fn("count", "*"), "count"],
    ],
    include: [
      {
        model: User,
        as: "creater",
      },
    ],
    where: { dueDate: { [Op.ne]: null } },
    order: [[db.Sequelize.literal("count"), "DESC"]],
    limit: 5,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving task due date Top5." });
    });
};

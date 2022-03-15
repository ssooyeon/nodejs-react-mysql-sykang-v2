const db = require("../models");
const Log = db.logs;
const Op = db.Sequelize.Op;

/**
 * 로그 생성
 */
exports.create = (req, res) => {
  if (!req.body.message) {
    res.status(400).send({ message: "Message cannot be empty." });
    return;
  }
  const log = req.body;
  Log.create(log)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while creating the Log." });
    });
};

/**
 * 로그 전체 조회
 */
exports.findAll = (req, res) => {
  Log.findAll({
    order: [["createdAt", "DESC"]],
    offset: 0,
    limit: 10,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving logs." });
    });
};

/**
 * 로그 월별/일별 조회
 */
exports.findAllByChart = (req, res) => {
  const { category, status } = req.query;

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

  Log.findAll({
    group: [db.Sequelize.fn(category, db.Sequelize.col("createdAt")), "status"],
    attributes: [
      "status",
      [db.Sequelize.fn("date_format", db.Sequelize.col("createdAt"), format), "name"],
      [db.Sequelize.fn("count", db.Sequelize.col("status")), "count"],
    ],
    order: [["createdAt", "ASC"]],
    where: {
      status: { [Op.eq]: status },
      createdAt: {
        [Op.gt]: start,
        [Op.lt]: end,
      },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving monthly logs." });
    });
};

/**
 * 사용자 로그인 수 월별/일별 조회
 */
exports.findAllLoginByChart = (req, res) => {
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

  Log.findAll({
    group: [db.Sequelize.fn(category, db.Sequelize.col("createdAt"))],
    attributes: [
      [db.Sequelize.fn("date_format", db.Sequelize.col("createdAt"), format), "name"],
      [db.Sequelize.fn("count", "*"), "count"],
    ],
    order: [["createdAt", "ASC"]],
    where: {
      message: { [Op.like]: `%login successfully%` },
      createdAt: {
        [Op.gt]: start,
        [Op.lt]: end,
      },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving user login logs." });
    });
};

/**
 * 사용자 로그인 수 top5 조회
 */
exports.findTop5Login = (req, res) => {
  Log.findAll({
    group: [db.Sequelize.fn("date", db.Sequelize.col("createdAt"))],
    attributes: [
      [db.Sequelize.fn("date_format", db.Sequelize.col("createdAt"), "%Y-%m-%d"), "name"],
      [db.Sequelize.fn("count", "*"), "count"],
    ],
    where: { message: { [Op.like]: `%login successfully%` } },
    order: [[db.Sequelize.literal("count"), "DESC"]],
    limit: 5,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving user login Top5." });
    });
};

/**
 * 로그 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Log.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || `Error retrieving Log with id=${id}` });
    });
};

/**
 * 로그 내용으로 조회
 */
exports.findAllByMessage = (req, res) => {
  const message = req.params.message;
  const condition = message ? { message: { [Op.like]: `%${message}%` } } : null;
  Log.findAll({
    where: condition,
    order: [["createdAt", "DESC"]],
    offset: 0,
    limit: 10,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving logs using message." });
    });
};

/**
 * 로그 수정
 */

/**
 * 로그 삭제
 */

/**
 * 로그 전체 삭제
 */

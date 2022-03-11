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
  if (category === "date") {
    format = "%m-%d";
  }

  Log.findAll({
    group: [db.Sequelize.fn(category, db.Sequelize.col("createdAt"))],
    attributes: [
      [db.Sequelize.fn("date_format", db.Sequelize.col("createdAt"), format), "createdAt"],
      [db.Sequelize.fn("count", "*"), "count"],
    ],
    order: [["createdAt", "DESC"]],
    where: status ? { status: status } : null,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving monthly logs." });
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

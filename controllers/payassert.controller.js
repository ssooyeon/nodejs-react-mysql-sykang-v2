const db = require("../models");
const User = db.users;
const Assert = db.payasserts;
const Log = db.logs;
const Op = db.Sequelize.Op;

/**
 * assert 생성
 */
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name cannot be empty." });
    return;
  }
  const assert = req.body;
  Assert.create(assert)
    .then((data) => {
      Log.create({ status: "SUCCESS", message: `Assert create successfully. New Assert name is: ${req.body.name}` });
      res.send(data);
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Assert create failed. Assert name is: ${req.body.name}` });
      res.status(500).send({ message: err.message || "Some error occurred while creating the Assert." });
    });
};

/**
 * 사용자별 assert 전체 조회
 */
exports.findAll = (req, res) => {
  const { userId } = req.query;
  const condition = userId ? { createrId: userId } : null;
  Assert.findAll({
    where: condition,
    include: [
      {
        model: User,
        as: "creater",
      },
    ],
    order: [["ordering", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving asserts." });
    });
};

/**
 * assert 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Assert.findByPk(id, {
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
      res.status(500).send({ message: err.message || `Error retrieving Assert with id=${id}` });
    });
};

/**
 * assert 수정
 */
exports.update = (req, res) => {
  const id = req.params.id;
  Assert.update(req.body, { where: { id: id } })
    .then((num) => {
      Log.create({ status: "SUCCESS", message: `Assert update successfully. Assert name is: ${req.body.name}` });
      res.send({ message: "Assert was updated successfully." });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Assert update failed. Assert name is: ${req.body.name}` });
      res.status(500).send({ message: err.message || `Error updating Assert with id=${id}` });
    });
};

/**
 * assert 삭제
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  Assert.destroy({ where: { id: id } })
    .then((num) => {
      if (num === 1) {
        Log.create({ status: "SUCCESS", message: `Assert delete successfully. New Assert id is: ${id}` });
        res.send({ message: "Assert was deleted successfully." });
      } else {
        res.send({ message: `Cannot delete Assert with id=${id}. maybe Assert was not found.` });
      }
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Assert delete failed. Assert id is: ${id}` });
      res.status(500).send({ message: err.message || `Could not delete Assert with id=${id}` });
    });
};

/**
 * assert 전체 삭제
 */
exports.deleteAll = (req, res) => {
  Assert.destroy({ where: {}, truncate: false })
    .then((nums) => {
      Log.create({ status: "SUCCESS", message: "All asserts delete successfully." });
      res.send({ message: `${nums} Asserts were deleted successfully.` });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: "All asserts delete failed" });
      res.status(500).send({ message: err.message || "Some error occurred while deleting all asserts." });
    });
};

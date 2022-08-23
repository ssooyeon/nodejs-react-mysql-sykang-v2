const db = require("../models");
const User = db.users;
const Cat = db.paycats;
const Log = db.logs;
const Op = db.Sequelize.Op;

/**
 * cat 생성
 */
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Name cannot be empty." });
    return;
  }
  const cat = req.body;
  Cat.create(cat)
    .then((data) => {
      Log.create({ status: "SUCCESS", message: `Cat create successfully. New Cat name is: ${req.body.name}` });
      res.send(data);
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Cat create failed. Cat name is: ${req.body.name}` });
      res.status(500).send({ message: err.message || "Some error occurred while creating the Cat." });
    });
};

/**
 * 사용자별 cat 전체 조회
 */
exports.findAll = (req, res) => {
  const { userId, type } = req.query;
  const condition1 = userId ? { createrId: userId } : null;
  const condition2 = type ? { type: type } : null;
  const condition3 = { parentId: { [Op.eq]: null } };
  Cat.findAll({
    where: {
      [Op.and]: [condition1, condition2, condition3],
    },
    include: [
      {
        model: User,
        as: "creater",
      },
      {
        model: Cat,
        as: "children",
      },
    ],
    order: [["ordering", "ASC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving cats." });
    });
};

/**
 * cat 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Cat.findByPk(id, {
    include: [
      {
        model: User,
        as: "creater",
      },
      {
        model: Cat,
        as: "children",
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || `Error retrieving Cat with id=${id}` });
    });
};

/**
 * cat 수정
 */
exports.update = (req, res) => {
  const id = req.params.id;
  Cat.update(req.body, { where: { id: id } })
    .then((num) => {
      Log.create({ status: "SUCCESS", message: `Cat update successfully. Cat name is: ${req.body.name}` });
      res.send({ message: "Cat was updated successfully." });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Cat update failed. Cat name is: ${req.body.name}` });
      res.status(500).send({ message: err.message || `Error updating Cat with id=${id}` });
    });
};

/**
 * cat 삭제
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  Cat.destroy({ where: { id: id } })
    .then((num) => {
      if (num === 1) {
        Log.create({ status: "SUCCESS", message: `Cat delete successfully. New Cat id is: ${id}` });
        res.send({ message: "Cat was deleted successfully." });
      } else {
        res.send({ message: `Cannot delete Cat with id=${id}. maybe Cat was not found.` });
      }
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Cat delete failed. Cat id is: ${id}` });
      res.status(500).send({ message: err.message || `Could not delete Cat with id=${id}` });
    });
};

/**
 * cat 전체 삭제
 */
exports.deleteAll = (req, res) => {
  Cat.destroy({ where: {}, truncate: false })
    .then((nums) => {
      Log.create({ status: "SUCCESS", message: "All cats delete successfully." });
      res.send({ message: `${nums} Cats were deleted successfully.` });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: "All cats delete failed" });
      res.status(500).send({ message: err.message || "Some error occurred while deleting all cats." });
    });
};

const db = require("../models");
const Inbox = db.inboxs;
const User = db.users;
const Log = db.logs;
const Op = db.Sequelize.Op;

/**
 * Inbox 생성
 */
exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "title cannot be empty." });
    return;
  }
  const inbox = req.body;
  Inbox.create(inbox)
    .then((data) => {
      Log.create({ status: "SUCCESS", message: `Inbox create successfully. New Inbox title is: ${req.body.title}` });
      res.send(data);
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Inbox create failed. Inbox title is: ${req.body.title}` });
      res.status(500).send({ message: err.message || "Some error occurred while creating the Inbox." });
    });
};

/**
 * Inbox 전체 조회 또는 사용자 별 검색
 */
exports.findAll = (req, res) => {
  const { receiverId, folderName } = req.query;
  const condition = receiverId ? { receiverId: receiverId } : null;
  const condition2 = folderName ? { folderName: folderName } : null;
  Inbox.findAll({
    where: {
      [Op.and]: [condition, condition2],
    },
    include: [
      {
        model: User,
        as: "sender",
      },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving inboxs." });
    });
};

/**
 * Inbox folderName 별 isConfirmed count 개수 확인
 */
exports.findIsConfirmedCount = (req, res) => {
  const { receiverId } = req.query;
  const condition = receiverId ? { receiverId: receiverId } : null;

  Inbox.findAll({
    where: {
      [Op.and]: [condition, { isConfirmed: false }],
    },
    attributes: ["folderName", [db.sequelize.fn("COUNT", db.sequelize.col("folderName")), "count"]],
    group: "folderName",
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving inboxs count group by folder name." });
    });
};

/**
 * Inbox 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Inbox.findByPk(id, {})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || `Error retrieving Inbox with id=${id}` });
    });
};

/**
 * Inbox 수정
 */
exports.update = (req, res) => {
  // if (!req.body.title) {
  //   res.status(400).send({ message: "title cannot be empty." });
  //   return;
  // }

  const id = req.params.id;
  const inbox = req.body;

  Inbox.update(inbox, { where: { id: id } })
    .then((num) => {
      Log.create({ status: "SUCCESS", message: `Inbox update successfully. Inbox id=${id}` });
      res.send({ message: "Inbox was updated successfully." });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Inbox update failed. Inbox title id=${id}` });
      res.status(500).send({ message: err.message || `Error updating Inbox with id=${id}` });
    });
};

/**
 * Inbox 삭제
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  Inbox.destroy({ where: { id: id } })
    .then((num) => {
      if (num === 1) {
        Log.create({ status: "SUCCESS", message: `Inbox delete successfully. Inbox id is: ${id}` });
        res.send({ message: "Inbox was deleted successfully." });
      } else {
        res.send({ message: `Cannot delete Inbox with id=${id}. maybe Inbox was not found.` });
      }
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Inbox delete failed. Inbox id is: ${id}` });
      res.status(500).send({ message: err.message || `Could not delete Inbox with id=${id}` });
    });
};

/**
 * Inbox 전체 삭제
 */
exports.deleteAll = (req, res) => {
  Inbox.destroy({ where: {}, truncate: false })
    .then((nums) => {
      Log.create({ status: "SUCCESS", message: "All inboxs delete successfully." });
      res.send({ message: `${nums} inboxs were deleted successfully.` });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: "All inboxs delete failed" });
      res.status(500).send({ message: err.message || "Some error occurred while deleting all inboxs." });
    });
};

/**
 * folderName 별 Inbox 전체 삭제
 */
exports.deleteAllInFolder = (req, res) => {
  if (!req.query.receiverId && req.query.folderName) {
    res.status(400).send({ message: "receiverId and folderName cannot be empty." });
    return;
  }

  const { receiverId, folderName } = req.query;
  Inbox.destroy({
    where: {
      receiverId: receiverId,
      folderName: folderName,
    },
    truncate: false,
  })
    .then((nums) => {
      Log.create({ status: "SUCCESS", message: "All inboxs in specific folder delete successfully." });
      res.send({ message: `${nums} inboxs in specific folder were deleted successfully.` });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: "All inboxs in specific folder delete failed" });
      res.status(500).send({ message: err.message || "Some error occurred while deleting all inboxs in specific folder." });
    });
};

const db = require("../models");
const Pay = db.pays;
const User = db.users;
const Assert = db.payasserts;
const Cat = db.paycats;
const Log = db.logs;
const Op = db.Sequelize.Op;

/**
 * payment 생성
 */
exports.create = (req, res) => {
  if (!req.body.amount) {
    res.status(400).send({ message: "Amount cannot be empty." });
    return;
  }
  const pay = req.body;
  Pay.create(pay)
    .then((data) => {
      Log.create({ status: "SUCCESS", message: `Pay create successfully. New Pay amount is: ${req.body.amount}` });
      res.send(data);
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Pay create failed. Pay amount is: ${req.body.amount}` });
      res.status(500).send({ message: err.message || "Some error occurred while creating the Pay." });
    });
};

/**
 * 사용자별 payment 전체 조회
 */
exports.findAll = (req, res) => {
  const { userId } = req.query;
  const condition = userId ? { createrId: userId } : null;
  Pay.findAll({
    where: condition,
    include: [
      {
        model: User,
        as: "creater",
      },
      {
        model: Assert,
        as: "assert",
      },
      {
        model: Cat,
        as: "cat",
      },
    ],
    order: [["date", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving pays." });
    });
};

/**
 * payment 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Pay.findByPk(id, {
    include: [
      {
        model: User,
        as: "creater",
      },
      {
        model: Assert,
        as: "assert",
      },
      {
        model: Cat,
        as: "cat",
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || `Error retrieving Pay with id=${id}` });
    });
};

/**
 * payment 수정
 */
exports.update = (req, res) => {
  const id = req.params.id;
  Pay.update(req.body, { where: { id: id } })
    .then((num) => {
      Log.create({ status: "SUCCESS", message: `Pay update successfully. Pay amount is: ${req.body.amount}` });
      res.send({ message: "Pay was updated successfully." });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Pay update failed. Pay amount is: ${req.body.amount}` });
      res.status(500).send({ message: err.message || `Error updating Pay with id=${id}` });
    });
};

/**
 * payment 삭제
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  Pay.destroy({ where: { id: id } })
    .then((num) => {
      if (num === 1) {
        Log.create({ status: "SUCCESS", message: `Pay delete successfully. New Pay id is: ${id}` });
        res.send({ message: "Pay was deleted successfully." });
      } else {
        res.send({ message: `Cannot delete Pay with id=${id}. maybe Pay was not found.` });
      }
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: `Pay delete failed. Pay id is: ${id}` });
      res.status(500).send({ message: err.message || `Could not delete Pay with id=${id}` });
    });
};

/**
 * payment 전체 삭제
 */
exports.deleteAll = (req, res) => {
  Pay.destroy({ where: {}, truncate: false })
    .then((nums) => {
      Log.create({ status: "SUCCESS", message: "All pays delete successfully." });
      res.send({ message: `${nums} Pays were deleted successfully.` });
    })
    .catch((err) => {
      Log.create({ status: "ERROR", message: "All pays delete failed" });
      res.status(500).send({ message: err.message || "Some error occurred while deleting all pays." });
    });
};

/************************************************************ 통계 */
/**
 * today total income/spending 조회
 */
exports.todayAmount = (req, res) => {
  const { userId } = req.query;
  const condition = userId ? { createrId: userId } : null;

  Pay.findAll({
    where: condition,
    attributes: [
      [
        db.Sequelize.fn("SUM", db.Sequelize.literal("CASE WHEN amount>0 AND DATE_FORMAT(date, '%Y-%m-%d') = CURDATE() THEN amount ELSE 0 END")),
        "today_income",
      ],
      [
        db.Sequelize.fn("SUM", db.Sequelize.literal("CASE WHEN amount<0 AND DATE_FORMAT(date, '%Y-%m-%d') = CURDATE() THEN amount ELSE 0 END")),
        "today_spending",
      ],
      [
        db.Sequelize.fn(
          "SUM",
          db.Sequelize.literal("CASE WHEN amount<0 AND DATE_FORMAT(date, '%Y-%m-%d') = SUBDATE(CURDATE(),1) THEN amount ELSE 0 END")
        ),
        "yesterday_spending",
      ],
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving today total amount." });
    });
};

/**
 * this month income/spending 조회
 */
exports.monthAmount = (req, res) => {
  const { userId } = req.query;
  const condition = userId ? { createrId: userId } : null;

  Pay.findAll({
    where: condition,
    attributes: [
      [
        db.Sequelize.fn(
          "SUM",
          db.Sequelize.literal("CASE WHEN amount>0 AND DATE_FORMAT(date, '%Y-%m-01') = DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN amount ELSE 0 END")
        ),
        "thismonth_income",
      ],
      [
        db.Sequelize.fn(
          "SUM",
          db.Sequelize.literal("CASE WHEN amount<0 AND DATE_FORMAT(date, '%Y-%m-01') = DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN amount ELSE 0 END")
        ),
        "thismonth_spending",
      ],
      [
        db.Sequelize.fn(
          "SUM",
          db.Sequelize.literal(
            "CASE WHEN amount<0 AND DATE_FORMAT(date, '%Y-%m-01') = DATE_FORMAT(CURDATE()-INTERVAL 1 MONTH, '%Y-%m-01') THEN amount ELSE 0 END"
          )
        ),
        "lastmonth_spending",
      ],
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving month total amount." });
    });
};

/**
 * 카테고리별 지출 내역 조회
 */
exports.findSpendingByCat = (req, res) => {
  Pay.findAll({
    include: [
      {
        model: Cat,
        as: "cat",
      },
    ],
    group: ["catId"],
    attributes: [
      [db.Sequelize.col("cat.name"), "name"],
      [db.Sequelize.fn("count", "*"), "count"],
      [
        db.Sequelize.fn(
          "SUM",
          db.Sequelize.literal(
            "CASE WHEN amount<0 AND DATE_FORMAT(date, '%Y-%m-01') = DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN ABS(amount) ELSE 0 END"
          )
        ),
        "thismonth_spending",
      ],
    ],
    order: [[db.Sequelize.literal("thismonth_spending"), "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving payment category statistic." });
    });
};

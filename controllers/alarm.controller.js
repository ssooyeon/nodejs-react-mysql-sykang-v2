const db = require("../models");
const Alarm = db.alarms;
const User = db.users;
const Group = db.groups;

/**
 * 알람 생성
 */
exports.create = (req, res) => {
  if (!req.body.message) {
    res.status(400).send({ message: "Message cannot be empty." });
    return;
  }
  const alarm = req.body;
  Alarm.create(alarm)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while creating the alarm." });
    });
};

/**
 * 그룹의 멤버 조회 후 알람 추가
 */
exports.createWithGroupMembers = (req, res) => {
  const { userId, groupId } = req.body.id;
  // user id로 group 찾기
  if (userId !== null) {
    User.findByPk(userId)
      .then((data) => {
        // 그룹이 있으면 해당 그룹의 멤버들을 찾아 alarm에 추가
        if (data.groupId !== null) {
          Group.findByPk(data.groupId, {
            include: [{ model: User, as: "users" }],
          })
            .then((group) => {
              // 멤버 리스트 뽑아서 알람 추가
              let alarms = [];
              const userList = group.users.map((user) => user.id);
              userList.map((id) => {
                alarms.push({ ...req.body.alarm, notify: false, userId: id });
              });
              Alarm.bulkCreate(alarms);
              res.send({ message: "Alarms created done." });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          res.send({ message: "The group to which the user belongs does not exist." });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || "Some error occurred retrieving user." });
      });
  } else {
    // groupId로 바로 조회 후 alarm에 추가
    Group.findByPk(groupId, {
      include: [{ model: User, as: "users" }],
    })
      .then((group) => {
        // 멤버 리스트 뽑아서 알람 추가
        let alarms = [];
        const userList = group.users.map((user) => user.id);
        userList.map((id) => {
          alarms.push({ ...req.body.alarm, notify: false, userId: id });
        });
        Alarm.bulkCreate(alarms);
        res.send({ message: "Alarms created done." });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || "Some error occurred retrieving group." });
      });
  }
};

/**
 * 알람 전체 조회
 */
exports.findAll = (req, res) => {
  Alarm.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving alarms." });
    });
};

/**
 * 알람 조회
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Alarm.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || `Error retrieving alarm with id=${id}` });
    });
};

/**
 * 알람 사용자로 조회
 */
exports.findAllByUser = (req, res) => {
  const userId = req.params.userId;
  Alarm.findAll({
    where: { userId: userId },
    order: [["createdAt", "DESC"]],
    // offset: 0,
    // limit: 10,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving alarms using userId." });
    });
};

/**
 * 알람 수정 (notify)
 */
exports.update = (req, res) => {
  const id = req.params.id;
  Alarm.update(req.body, { where: { id: id } })
    .then((num) => {
      Alarm.create({ status: "SUCCESS", message: `Alarm notify update successfully. Alarm id is: ${id}` });
      res.send({ message: "Alarm notify was updated successfully." });
    })
    .catch((err) => {
      Alarm.create({ status: "ERROR", message: `Alarm notify update failed. Alarm id is: ${id}` });
      res.status(500).send({ message: err.message || `Error updating Alarm notify with id=${id}` });
    });
};

/**
 * 알람 삭제
 */

/**
 * 알람 전체 삭제
 */

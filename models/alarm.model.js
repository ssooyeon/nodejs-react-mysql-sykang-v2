module.exports = (sequelize, Sequelize) => {
  const Alarm = sequelize.define("alarm", {
    message: {
      type: Sequelize.STRING,
    },
    notify: {
      type: Sequelize.BOOLEAN,
    },
    status: {
      type: Sequelize.ENUM("INFO", "ERROR"),
      defaultValue: "INFO",
    },
  });

  return Alarm;
};

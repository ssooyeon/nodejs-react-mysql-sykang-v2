module.exports = (sequelize, Sequelize) => {
  const Paycat = sequelize.define("paycat", {
    name: {
      type: Sequelize.STRING,
    },
    ordering: {
      type: Sequelize.INTEGER,
    },
  });

  return Paycat;
};

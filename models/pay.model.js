module.exports = (sequelize, Sequelize) => {
  const Pay = sequelize.define("pay", {
    amount: {
      type: Sequelize.INTEGER,
    },
    description: {
      type: Sequelize.TEXT,
    },
    date: {
      type: Sequelize.DATE,
    },
  });

  return Pay;
};

module.exports = (sequelize, Sequelize) => {
  const Payassert = sequelize.define("payassert", {
    name: {
      type: Sequelize.STRING,
    },
    ordering: {
      type: Sequelize.INTEGER,
    },
  });

  return Payassert;
};

module.exports = (sequelize, Sequelize) => {
  const Inbox = sequelize.define("inbox", {
    title: {
      type: Sequelize.TEXT,
    },
    content: {
      type: Sequelize.TEXT,
    },
    isConfirmed: {
      type: Sequelize.BOOLEAN,
    },
    folderName: {
      type: Sequelize.TEXT,
    },
  });

  return Inbox;
};

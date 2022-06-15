module.exports = (sequelize, Sequelize) => {
  const Inbox = sequelize.define("inbox", {
    title: {
      type: Sequelize.TEXT,
    },
    content: {
      type: Sequelize.TEXT,
    },
    folderName: {
      type: Sequelize.TEXT,
    },
    isConfirmed: {
      type: Sequelize.BOOLEAN,
    },
    isSend: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Inbox;
};

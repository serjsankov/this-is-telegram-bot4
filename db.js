const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  "serjsapq_bot",
  "serjsapq_bot",
  "Serega141297!",
  {
    host: "serjsapq.beget.tech",
    dialect: "mysql",
  }
);

module.exports = (sql, Sequelize) => {
    const DigSingleVal = sql.define('dig_single_val', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        report_date: {
          type: Sequelize.DATE
        },
        report_date_str: {
          type: Sequelize.STRING
        },
        application: {
          type: Sequelize.STRING
        },
        avail_a: {
          type: Sequelize.STRING
        },
        avail_b: {
          type: Sequelize.STRING
        },
        errors_a: {
          type: Sequelize.STRING
        },
        tpm_a: {
          type: Sequelize.STRING
        },
        tpm_b: {
          type: Sequelize.STRING
        },
        created_at: {
          type: Sequelize.DATE
        }
    },
    {
      timestamps: false
    });
    return DigSingleVal
  }
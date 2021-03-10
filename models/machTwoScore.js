module.exports = (sequelize, DataTypes) => {
    const machTwoScore = sequelize.define('machTwoScore', {
      score: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
        },
      },
    });
  
    machTwoScore.associate = (models) => {
      machTwoScore.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
  
    return machTwoScore;
  };
  
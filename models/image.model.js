module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
      type: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
      data: {
        type: DataTypes.BLOB("long"),
      },
    });
    Image.associate = (models) => {
      Image.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
    return Image;
  };
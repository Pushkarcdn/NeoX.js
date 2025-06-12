import CommonEntity from "../../../../configs/common.entities.js";

export default (sequelize, DataTypes) => {
  const Seller = sequelize.define("seller", {
    ...CommonEntity,

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user",
        key: "userId",
      },
    },
    firstName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists!",
      },
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    oAuthProvider: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    oAuthId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isTermsAndConditionsAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Seller.associate = (models) => {
    Seller.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Seller;
};

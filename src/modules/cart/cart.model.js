import CommonEntity from "../../../configs/common.entities.js";

export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart", {
    ...CommonEntity,

    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "buyer",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "product",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  return Cart;
};

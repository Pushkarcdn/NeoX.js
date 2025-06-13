import { NotFoundException } from "../../exceptions/index.js";
import { models } from "../../../configs/server.js";
import { successResponse } from "../../utils/index.js";

export default (router) => {
  router.route("/:model/:id").delete(async (req, res, next) => {
    try {
      const { model, id } = req?.params || {};
      const module = models?.[model];

      if (!module || !model || !id) {
        throw new NotFoundException(`${model} not found!`, model);
      }

      const existingData = await module?.findByPk(id);
      if (!existingData) {
        throw new NotFoundException(`${model} not found!`, model);
      }

      const data = await module?.destroy({ where: { id } });
      if (!data) {
        throw new NotFoundException(`Not deleted!`, model);
      }

      successResponse(res, `${model} deleted successfully!`, "delete", model);
    } catch (err) {
      next(err);
    }
  });
};

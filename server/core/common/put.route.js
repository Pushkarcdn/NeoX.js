import { NotFoundException } from "../../exceptions/index.js";
import { models } from "../../../configs/server.js";
import { successResponse } from "../../utils/index.js";

export default (router) => {
  router.route("/:model/:id").put(async (req, res, next) => {
    try {
      const { model, id } = req.params;
      const module = models[model];
      if (!module) {
        throw new NotFoundException(`${model} not found!`, model);
      }
      const payload = req.body;
      const data = await module?.update(payload, { where: { id } });
      if (!data) {
        throw new NotFoundException(`Not updated!`, model);
      }
      successResponse(res, data, "update", model);
    } catch (err) {
      next(err);
    }
  });
};

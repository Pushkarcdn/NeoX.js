import { NotFoundException } from "../../exceptions/index.js";
import { models } from "../../../configs/server.js";
import { successResponse } from "../../utils/index.js";

export default (router) => {
  router.route("/:model").post(async (req, res, next) => {
    try {
      const { model } = req.params;
      const payload = req.body;
      const module = models[model];
      if (!module) {
        throw new NotFoundException(`${model} not found!`, model);
      }
      const data = await module?.create(payload);
      if (!data) {
        throw new NotFoundException(`Not created!`, model);
      }
      successResponse(res, data, "create", model);
    } catch (err) {
      next(err);
    }
  });
};

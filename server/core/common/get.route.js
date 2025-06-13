import { NotFoundException } from "../../exceptions/index.js";
import { models } from "../../../configs/server.js";
import { successResponse } from "../../utils/index.js";

export default (router) => {
  router.route("/:model").get(async (req, res, next) => {
    try {
      const { model } = req.params;
      const module = models[model];
      if (!module) {
        throw new NotFoundException(`${model} not found!`, model);
      }
      const data = await module?.findAll();
      if (!data) {
        throw new NotFoundException(`${model} not found!`, model);
      }
      successResponse(res, data, "fetch", model);
    } catch (err) {
      next(err);
    }
  });

  router.route("/:model/:id").get(async (req, res, next) => {
    try {
      const { model, id } = req.params;
      const module = models[model];
      if (!module) {
        throw new NotFoundException("Not found!", model);
      }
      const data = await module?.findByPk(id);
      if (!data) {
        throw new NotFoundException(`${model} not found!`, model);
      }
      successResponse(res, data, "fetch", model);
    } catch (err) {
      next(err);
    }
  });
};

"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/project/template", controller.project.getTemplate);
  router.get("/page/template", controller.page.getTemplate);
  router.get("/section/template", controller.section.getTemplate);
  router.get("/monitor/upload", controller.moniter.upload);
  router.get("/project/oss", controller.project.getOSSProject);
  router.get("/oss/get", controller.project.getOSSFile);
  router.get("/redis/test", controller.project.getRedis);

  router.get("/test", controller.project.test);
  router.resources("components", "/api/v1/components", controller.v1.components);
  router.resources("componentSite", "/api/v1/componentSite", controller.v1.componentSite);
  // app.io.of('/')
  app.io.route("build", app.io.controller.build.index);
};

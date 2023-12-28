const shapeRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shapeRouter.get("/getRowByShape", async (req, res, next) => {
  try {
    let shape = req.query.shape;
    /*console.log(
        `Select * from magodmis.shapes where Shape =  "${shape}"`
      );*/
    misQueryMod(
      `Select * from magodmis.shapes where Shape =  "${shape}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

shapeRouter.get("/getAllShapeNames", async (req, res, next) => {
  try {
    misQueryMod(
      `SELECT s.Shape FROM magodmis.shapes s ORDER BY s.Shape`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = shapeRouter;

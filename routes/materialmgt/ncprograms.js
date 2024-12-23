const ncprogramsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

ncprogramsRouter.post("/updateQtyAllotedncprograms", async (req, res, next) => {
  try {
    let { Id, Qty } = req.body;
    misQueryMod(
      `UPDATE magodmis.ncprograms n SET n.QtyAllotted=n.QtyAllotted-${Qty} WHERE n.Ncid= ${Id}`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(`successfully updated ncprograms for Ncid= ${Id}`);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

ncprogramsRouter.post(
  "/updateQtyAllotedncprograms1",
  async (req, res, next) => {
    try {
      let { Id, Qty } = req.body;
      misQueryMod(
        `UPDATE magodmis.ncprograms n SET n.QtyAllotted=n.QtyAllotted+${Qty}, n.PStatus='Processing' WHERE n.Ncid= ${Id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(`successfully updated ncprograms with Ncid=${Id}`);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

ncprogramsRouter.post(
  "/updateQtyAllotedncprograms2",
  async (req, res, next) => {
    try {
      let { Id, Qty } = req.body;
      misQueryMod(
        `UPDATE magodmis.ncprograms n SET n.QtyAllotted=n.QtyAllotted+${Qty}, n.PStatus='Cutting' WHERE n.Ncid= ${Id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(`successfully updated ncprograms for Ncid=${Id}`);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

ncprogramsRouter.get("/getRowByNCID", async (req, res, next) => {
  try {
    let id = req.query.id;
    misQueryMod(
      `Select * from magodmis.ncprograms where Ncid = ${id}`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully fetched data from ncprograms with Ncid = ${id}`
        );
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = ncprogramsRouter;

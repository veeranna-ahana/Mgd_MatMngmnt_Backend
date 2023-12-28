const materialLocationListRouter = require("express").Router();
const { setupQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

materialLocationListRouter.get(
  "/allMaterialLocationList",
  async (req, res, next) => {
    try {
      setupQueryMod(
        "Select * from magod_setup.material_location_list order by LocationNo asc",
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialLocationListRouter.post(
  "/deleteMaterialLocationList",
  async (req, res, next) => {
    try {
      let { LocationNo } = req.body;
      setupQueryMod(
        `DELETE FROM magod_setup.material_location_list WHERE LocationNo='${LocationNo}'`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialLocationListRouter.post(
  "/updateMaterialLocationList",
  async (req, res, next) => {
    try {
      let { LocationNo, StorageType, Capacity } = req.body;
      setupQueryMod(
        `UPDATE  magod_setup.material_location_list 
        SET StorageType='${StorageType}', Capacity=${Capacity} 
        WHERE LocationNo='${LocationNo}'`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialLocationListRouter.post(
  "/insertMaterialLocationList",
  async (req, res, next) => {
    try {
      let { LocationNo, StorageType, Capacity } = req.body;
      setupQueryMod(
        `INSERT INTO magod_setup.material_location_list
          (LocationNo, StorageType, Capacity) 
          Values('${LocationNo}', '${StorageType}', ${Capacity})`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = materialLocationListRouter;

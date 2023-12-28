const shopFloorIssueRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shopFloorIssueRouter.get("/getPartIssueVoucherList", async (req, res, next) => {
  try {
    let status = req.query.status;

    misQueryMod(
      `SELECT n1.DwgName as AssyName, s.*, n.TaskNo, n.NcId, n.Machine, n.Operation, 
      n.Mtrl_Code, n.CustMtrl, n.Cust_Code, c.Cust_Name FROM magodmis.shopfloor_part_issueregister s,
      magodmis.ncprograms n,magodmis.ncprogram_partslist n1,magodmis.cust_data c
      WHERE s.NcId=n.Ncid AND  n1.NcId=n.Ncid  AND s.Status="${status}" AND  n.Cust_Code= c.Cust_Code order by Issue_date DESC`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

shopFloorIssueRouter.get(
  "/getProductionMaterialIssueParts",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT n1.DwgName as AssyName, s.*, n.TaskNo, n.NCProgramNo, n.NcId, n.Machine, n.Operation,
      n.Mtrl_Code, n.CustMtrl, n.Cust_Code FROM magodmis.shopfloor_part_issueregister s,
      magodmis.ncprograms n,magodmis.ncprogram_partslist n1 
      WHERE s.NcId=n.Ncid AND  n1.NcId=n.Ncid AND s.IssueID=${id}`,
        (err, data) => {
          if (err) logger.error(err);
          data && data.length !== 0 ? res.send(data[0]) : res.send([]);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

shopFloorIssueRouter.get(
  "/getProductionMaterialIssuePartsTable",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT s.*, m.PartId, m1.RV_No,m1.CustDocuNo FROM
        magodmis.shopfloor_bom_issuedetails s,magodmis.mtrl_part_receipt_details m,
        magodmis.material_receipt_register m1 WHERE m.Id=s.PartReceipt_DetailsID 
        AND m1.RvID=s.RV_Id AND s.IV_ID=${id}`,
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

shopFloorIssueRouter.get(
  "/getMaterialIssueVoucherList",
  async (req, res, next) => {
    try {
      let status = req.query.status;

      misQueryMod(
        `SELECT s.*, c.Cust_Name, n.TaskNo, n.NcId, n.Machine, n.Operation,
        n.Mtrl_Code, n.CustMtrl, n.Cust_Code
    FROM magodmis.shopfloor_material_issueregister s,magodmis.cust_data c,magodmis.ncprograms n 
                    WHERE  s.Status="${status}" AND  n.Cust_Code= c.Cust_Code AND s.NcId=n.Ncid order by Issue_date DESC limit 100`,
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

shopFloorIssueRouter.get(
  "/getShopMaterialIssueVoucher",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT s.*, n.TaskNo, n.Machine,n.Operation,
        n.MProcess, c.Cust_name, n.Qty,n.CustMtrl, n.Mtrl_Code, n.Para1, n.Para2, n.Para3
        FROM magodmis.shopfloor_material_issueregister s, magodmis.ncprograms n,
        magodmis.cust_data c WHERE s.IssueID=${id} AND s.NcId=n.NcId
        and s.Status <> 'Closed' AND n.Cust_Code=c.Cust_Code Order By s.Iv_No`,
        (err, data) => {
          if (err) logger.error(err);
          data && data.length !== 0 ? res.send(data[0]) : res.send([]);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);
shopFloorIssueRouter.get(
  "/getShopMaterialIssueVoucherTable",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT n.NcPgmMtrlId,n.IssueId,n.ShapeMtrlID, n.Para1, n.Para2,
        n.Para3, n.Used, n.Rejected 
        FROM magodmis.ncprogrammtrlallotmentlist n
        WHERE n.IssueId=${id}`,
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

shopFloorIssueRouter.get(
  "/getShopFloorServicePartTable",
  async (req, res, next) => {
    try {
      let type = req.query.type;
      let hasbom = req.query.hasbom;

      misQueryMod(
        `SELECT n.*,c.Cust_Name
FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
AND o.Type='${type}' and HasBOM = ${hasbom}
ORDER BY n.Ncid desc`,
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

shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewMachine",
  async (req, res, next) => {
    try {
      let type = req.query.type;
      let hasbom = req.query.hasbom;

      misQueryMod(
        `
        SELECT n.machine, count(*)
        FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
        WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
        AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
        AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
        AND o.Type='${type}' and HasBOM = ${hasbom} group by n.machine 
        `,
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

shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewProcess",
  async (req, res, next) => {
    try {
      let type = req.query.type;
      let hasbom = req.query.hasbom;
      let machine = req.query.machine;
      let tree = req.query.tree;
      if (tree == 1) {
        misQueryMod(
          `
          SELECT n.MProcess, count(*)
          FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
          WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
          AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
          AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
          AND o.Type='${type}' and HasBOM = ${hasbom} and n.machine='${machine}' group by n.MProcess
          `,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT n.*,c.Cust_Name
          FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
          WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
          AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
          AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
          AND o.Type='${type}' and HasBOM = ${hasbom} and n.machine='${machine}'
          ORDER BY n.Ncid desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewMtrlCode",
  async (req, res, next) => {
    try {
      let type = req.query.type;
      let hasbom = req.query.hasbom;
      let machine = req.query.machine;
      let process = req.query.process;
      let tree = req.query.tree;
      if (tree == 1) {
        misQueryMod(
          `
        SELECT n.Mtrl_Code, count(*)
        FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
        WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
        AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
        AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
        AND o.Type='${type}' and HasBOM = ${hasbom} and n.machine='${machine}' and n.MProcess='${process}' group by n.Mtrl_Code
        `,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `
          SELECT n.*,c.Cust_Name
          FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
          WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
          AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
          AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
          AND o.Type='${type}' and HasBOM = ${hasbom} and n.machine='${machine}' and n.MProcess='${process}' 
          ORDER BY n.Ncid desc`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewMtrlCodeClick",
  async (req, res, next) => {
    try {
      let type = req.query.type;
      let hasbom = req.query.hasbom;
      let machine = req.query.machine;
      let process = req.query.process;
      let material = req.query.material;
      misQueryMod(
        `
          SELECT n.*,c.Cust_Name
          FROM magodmis.ncprograms n, magodmis.nc_task_list n1,magodmis.orderschedule o,magodmis.cust_data c
          WHERE n.Qty>n.QtyAllotted AND n.Machine is not Null 
          AND  not (n.PStatus='Created' OR n.PStatus='Suspended'OR n.PStatus='Closed' OR n.PStatus='ShortClosed')
          AND n1.NcTaskId=n.NcTaskId AND o.ScheduleId=n1.ScheduleID AND  n.Cust_Code=c.Cust_code 
          AND o.Type='${type}' and HasBOM = ${hasbom} and n.machine='${machine}' and n.MProcess='${process}' and n.Mtrl_Code = '${material}' 
          ORDER BY n.Ncid desc`,
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

module.exports = shopFloorIssueRouter;

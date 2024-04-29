const returnRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

returnRouter.get("/profileMaterialFirst", async (req, res, next) => {
  try {
    let Cust_Code = req.query.Cust_Code;

    misQueryMod(
      `SET @@sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')`,
      (err, groupBy) => {
        if (err) {
          logger.error(err);
        } else {
          misQueryMod(
            `SELECT 
              m1.Rv_date,
              m.Mtrl_Rv_id,
              m1.Cust_Code,
              m1.RV_No,
              m1.CustDocuNo AS Cust_Docu_No,
              m.Mtrl_Code,
              m.DynamicPara1,
              m.DynamicPara2,
              m.DynamicPara3,
              m.Scrap,
              SUM(m.Weight) AS Weight,
              SUM(m.ScrapWeight) AS ScrapWeight,
              COUNT(m.MtrlStockID) AS InStock
            FROM
                magodmis.mtrlstocklist m,
                magodmis.material_receipt_register m1
            WHERE
                    m.Issue = 0
                    AND m.Cust_Code = ${Cust_Code}
                    AND m1.Rv_No = m.rv_No
                    AND m1.RVStatus = 'Received'
            GROUP BY m.Mtrl_Rv_id , m.Mtrl_Code , m.DynamicPara1 , m.DynamicPara2 , m.Scrap
            ORDER BY m.Mtrl_Rv_id DESC`,

            //   `SELECT m1.RvID,m1.Rv_date,m.Mtrl_Rv_id, m1.Cust_Code, m1.RV_No, m1.CustDocuNo as Cust_Docu_No, m.Mtrl_Code,
            //   m.DynamicPara1, m.DynamicPara2, m.DynamicPara3, m.Scrap, m1.TotalWeight, m1.TotalCalculatedWeight, m.Material, m.Shape,
            //     sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight, count(m.MtrlStockID) as InStock
            // FROM magodmis.mtrlstocklist m, magodmis.material_receipt_register m1
            // WHERE  (m.Scrap or  not m.Locked) AND
            // m.Issue = 0 AND
            // m.Cust_Code=${Cust_Code} AND
            // m1.Rv_No=m.rv_No AND
            // m1.RVStatus='Received'
            // group by m1.RvID,m1.Rv_date,m.Mtrl_Rv_id, m1.Cust_Code, m1.RV_No, m1.CustDocuNo, m.Mtrl_Code, m.DynamicPara1,
            // m.DynamicPara2, m.DynamicPara3, m.Scrap, m1.TotalWeight, m1.TotalCalculatedWeight, m.Material, m.Shape`
            (err, data) => {
              if (err) logger.error(err);
              res.send(data);
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

returnRouter.get("/profileMaterialSecond", async (req, res, next) => {
  try {
    let Cust_Code = req.query.Cust_Code;
    misQueryMod(
      `SELECT 
          m1.RVId,
          m1.Cust_Code,
          m1.RV_No,
          m1.CustDocuNo AS Cust_Docu_No,
          m1.Type,
          m.Mtrl_Rv_id,
          m.Mtrl_Code,
          m.Material,
          m.DynamicPara1,
          m.DynamicPara2,
          m.DynamicPara3,
          m.Scrap,
          m.Weight,
          m.ScrapWeight,
          m.MtrlStockID
        FROM
            magodmis.mtrlstocklist m,
            magodmis.material_receipt_register m1
        WHERE
          m.Issue = 0
          AND m.Cust_Code = ${Cust_Code}
          AND m1.Rv_No = m.rv_No
          AND m1.RVStatus = 'Received'
        ORDER BY m.MtrlStockID`,

      // `SELECT
      //     m1.RVId,
      //     m.Mtrl_Rv_id,
      //     m1.Cust_Code,
      //     m1.RV_No,
      //     m1.CustDocuNo AS Cust_Docu_No,
      //     m.Mtrl_Code,
      //     m.DynamicPara1,
      //     m.DynamicPara2,
      //     m.DynamicPara3,
      //     m.Scrap,
      //     m.Weight,
      //     m.ScrapWeight,
      //     m.MtrlStockID,
      //     Issue,
      //     m1.TotalWeight,
      //     m1.TotalCalculatedWeight,
      //     m1.Type,
      //     m.Material,
      //     m.Issue
      // FROM
      //     magodmis.mtrlstocklist m,
      //     magodmis.material_receipt_register m1
      // WHERE
      //     (m.Scrap OR NOT m.Locked)
      //         AND m.Issue = 0
      //         AND m.Cust_Code = ${Cust_Code}
      //         AND m1.Rv_No = m.rv_No
      //         AND m1.RVStatus = 'Received'`
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

returnRouter.get("/partFirst", async (req, res, next) => {
  try {
    let Cust_Code = req.query.Cust_Code;
    misQueryMod(
      `SELECT 
          *,
          DATE_FORMAT(RV_Date, '%d/%m/%Y') AS RV_Date,
          DATE_FORMAT(ReceiptDate, '%d/%m/%Y') AS ReceiptDate
      FROM
          magodmis.material_receipt_register
      WHERE
          Type = 'Parts' AND RVStatus = 'Received'
              AND Cust_Code = ${Cust_Code}`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

returnRouter.get("/partSecond", async (req, res, next) => {
  try {
    let Cust_Code = req.query.Cust_Code;
    misQueryMod(
      `SELECT m1.*,m.* FROM magodmis.material_receipt_register m,magodmis.mtrl_part_receipt_details m1
WHERE m.Type='Parts' AND m.RVStatus='Received' AND m1.RVId=m.RvID  AND m.Cust_Code=${Cust_Code}`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = returnRouter;

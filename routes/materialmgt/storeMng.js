const storeRouter = require("express").Router();
const { misQueryMod, mtrlQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

/* 1. Resize Form */
storeRouter.get("/getResizeMtrlStockList", async (req, res, next) => {
  try {
    let Cust_Code = req.query.code;

    misQueryMod(
      `SELECT 
            *
        FROM
            magodmis.mtrlstocklist
        WHERE
            Cust_Code LIKE ${Cust_Code} AND Issue = 0  
            AND Locked = 0
            AND Scrap = 0
        ORDER BY Mtrl_Rv_id DESC , Mtrl_Code , MtrlStockID`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

/*2. Move Store */
storeRouter.get("/getMoveStoreMtrlStockByCustomer", async (req, res, next) => {
  try {
    let Cust_Code = req.query.code;

    misQueryMod(
      `SELECT * FROM magodmis.MtrlStocklist WHERE cust_code=${Cust_Code} AND (not Locked or Scrap )`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getMoveStoreMtrlStockByLocation", async (req, res, next) => {
  try {
    let LocationNo = req.query.location;

    misQueryMod(
      `SELECT * FROM magodmis.MtrlStocklist WHERE LocationNo='${LocationNo}' AND (not Locked or Scrap )`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get(
  "/getMoveStoreCustomerMtrlStockByLocation",
  async (req, res, next) => {
    try {
      let LocationNo = req.query.location;

      misQueryMod(
        `SET @@sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')`,
        (err, groupData) => {
          if (err) {
            logger.error(err);
          } else {
            misQueryMod(
              // `SELECT * FROM magodmis.MtrlStocklist WHERE LocationNo='${LocationNo}' AND (not Locked or Scrap )`,
              `SELECT * FROM magodmis.MtrlStocklist WHERE LocationNo='${LocationNo}' AND (NOT LOCKED OR Scrap ) GROUP BY Cust_Code
            `,
              (err, data) => {
                if (err) logger.error(err);
                // console.log("dataaaa", data);
                res.send(data);
              }
            );
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

storeRouter.get("/getMoveStoreMtrlStockByAll", async (req, res, next) => {
  try {
    misQueryMod(
      `SELECT * FROM magodmis.MtrlStocklist WHERE (not Locked or Scrap) order by MtrlStockID DESC limit 500 `,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

//update location in mtrlstock
storeRouter.post(
  "/updateMtrlstockLocationByMtrlStockId",
  async (req, res, next) => {
    try {
      let { LocationNo, MtrlStockID } = req.body;
      misQueryMod(
        `UPDATE magodmis.MtrlStocklist SET LocationNo='${LocationNo}'
       WHERE MtrlStockID='${MtrlStockID}'`,
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

/* 3. Location List */
//find count value
storeRouter.get("/getLocationListMtrlStockCount", async (req, res, next) => {
  let LocationNo = req.query.location;
  try {
    misQueryMod(
      `SELECT count(m.MtrlStockID) as count  FROM magodmis.mtrlstocklist m WHERE m.LocationNo like '${LocationNo}'`,
      (err, data) => {
        if (err) logger.error(err);
        //console.log("data =", data[0]);
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

/* stock List */
storeRouter.get("/getStockListByCustCodeFirst", async (req, res, next) => {
  let code = req.query.code;
  try {
    misQueryMod(
      `SELECT 
        m.Cust_Code,
        m1.Material,
        COUNT(m.MtrlStockID) AS Qty,
        SUM(m.Weight) AS Weight,
        SUM(m.ScrapWeight) AS ScrapWeight
        FROM
        magodmis.mtrlstocklist m,
        magodmis.mtrlgrades m1,
        magodmis.mtrl_data m2
        WHERE
        m.Cust_Code = ${code}
            AND (m.IV_No IS NULL OR m.IV_No = '')
            AND m2.Mtrl_Code = m.Mtrl_Code
            AND m1.MtrlGradeID = m2.MtrlGradeID
        GROUP BY m1.Material
        ORDER BY m1.Material`,

      //   `SELECT m.Cust_Code, m1.Material, count(m.MtrlStockID) as Qty,
      //   Sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight
      //  FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2
      //  WHERE m.Cust_Code= ${code} AND m.IV_No is  null AND m2.Mtrl_Code=m.Mtrl_Code
      //  AND m1.MtrlGradeID=m2.MtrlGradeID
      //  GROUP BY m1.Material
      //  ORDER BY m1.Material`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getStockListByCustCodeSecond", async (req, res, next) => {
  let code = req.query.code;
  try {
    misQueryMod(
      `SELECT 
      m.Cust_Code,
      m.Mtrl_Code,
      m1.Material,
      COUNT(m.MtrlStockID) AS Qty,
      SUM(m.Weight) AS Weight,
      SUM(m.ScrapWeight) AS ScrapWeight
  FROM
      magodmis.mtrlstocklist m,
      magodmis.mtrlgrades m1,
      magodmis.mtrl_data m2
  WHERE
      m.Cust_Code = ${code}
          AND (m.IV_No IS NULL OR m.IV_No = '')
          AND m2.Mtrl_Code = m.Mtrl_Code
          AND m1.MtrlGradeID = m2.MtrlGradeID
  GROUP BY m1.Material , m.Mtrl_Code
  ORDER BY m.Mtrl_Code`,
      // `SELECT m.Cust_Code,m.Mtrl_Code, m1.Material,
      // count(m.MtrlStockID) as Qty,
      //  Sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight
      // FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2
      // WHERE m.Cust_Code= ${code} AND m.IV_No is  null AND m2.Mtrl_Code=m.Mtrl_Code
      // AND m1.MtrlGradeID=m2.MtrlGradeID
      // GROUP BY  m1.Material,m.Mtrl_Code
      // ORDER BY m.Mtrl_Code`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getStockListByCustCodeThird", async (req, res, next) => {
  let code = req.query.code;
  try {
    misQueryMod(
      `SELECT 
        m.Cust_Code,
        m.Mtrl_Code,
        m.DynamicPara1,
        m.DynamicPara2,
        m.DynamicPara3,
        m.Locked,
        m.Scrap,
        m1.Material,
        COUNT(m.MtrlStockID) AS Qty,
        SUM(m.Weight) AS Weight,
        SUM(m.ScrapWeight) AS ScrapWeight
        FROM
        magodmis.mtrlstocklist m,
        magodmis.mtrlgrades m1,
        magodmis.mtrl_data m2
        WHERE
        m.Cust_Code = ${code}
            AND (m.IV_No IS NULL OR m.IV_No = '')
            AND m2.Mtrl_Code = m.Mtrl_Code
            AND m1.MtrlGradeID = m2.MtrlGradeID
        GROUP BY m.Mtrl_Code , m.DynamicPara1 , m.DynamicPara2 , m.DynamicPara3 , m.Locked , m.Scrap
        ORDER BY m.Scrap DESC , m.Mtrl_Code`,

      // `SELECT m.Cust_Code,m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2,
      // m.DynamicPara3, m.Locked, m.Scrap, m1.Material, count(m.MtrlStockID) as Qty,
      //  Sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight
      // FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2
      // WHERE m.Cust_Code= ${code} AND m.IV_No is  null AND m2.Mtrl_Code=m.Mtrl_Code
      // AND m1.MtrlGradeID=m2.MtrlGradeID
      // GROUP BY m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.DynamicPara3, m.Locked, m.Scrap
      // ORDER BY m.Scrap Desc , m.Mtrl_Code`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

/* Stock Arrival */

storeRouter.get("/getStockArrivalFirstTable", async (req, res, next) => {
  let date = req.query.date;
  try {
    misQueryMod(
      `SELECT  m.RV_No, m1.Material, 
      sum(m1.TotalWeightCalculated) as  TotalWeightCalculated,
          sum(m1.TotalWeight) as TotalWeight  , m.CustDocuNo 
          FROM magodmis.material_receipt_register m,magodmis.mtrlreceiptdetails m1 
          WHERE m.RV_No <> 'Draft' AND m.Rv_date='${date}' AND m1.RvID=m.RvID 
          AND m.Cust_Code='0000' 
          GROUP BY  m.RV_No, m1.Material,  m.CustDocuNo`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getStockArrivalSecondTable", async (req, res, next) => {
  let date = req.query.date;
  try {
    misQueryMod(
      `SELECT m1.Mtrl_Rv_id,m.Rv_date, m.RV_No, m1.Material, m1.TotalWeightCalculated,
      m1.TotalWeight, m.CustDocuNo, m1.Srl 
      FROM magodmis.material_receipt_register m,magodmis.mtrlreceiptdetails m1 
      WHERE m.RV_No<>'Draft' AND m.Rv_date='${date}' AND m1.RvID=m.RvID 
      AND m.Cust_Code='0000'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getStockArrivalThirdTable", async (req, res, next) => {
  let date = req.query.date;
  try {
    mtrlQueryMod(
      `SELECT * FROM magod_Mtrl.mtrl_receipt_list m WHERE m.Rv_Date='${date}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.post(
  "/insertStockArrivalMtrlReceiptList",
  async (req, res, next) => {
    try {
      let { Rv_Date, RV_No, CustDocuNo, Material, WeightIN } = req.body;
      mtrlQueryMod(
        `INSERT INTO magod_mtrl.mtrl_receipt_list 
      (Rv_Date, RV_No, CustDocuNo, Material, WeightIN)
      Values('${Rv_Date}', '${RV_No}', '${CustDocuNo}', '${Material}', ${WeightIN}) ON DUPLICATE KEY UPDATE WeightIN=${WeightIN}`,
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

/* Stock Dispatch */

storeRouter.get("/getStockDispatchFirstTable", async (req, res, next) => {
  let date = req.query.date;
  try {
    mtrlQueryMod(
      `SELECT d.DC_Inv_No, d.Inv_No, d.DC_No, d.Inv_Date, d.Cust_Name, d.DC_InvType, 
      d1.Material,sum( d1.DC_Srl_Wt) as DC_Srl_Wt 
      FROM magodmis.draft_dc_inv_register d,magodmis.draft_dc_inv_details d1 
      WHERE d.DC_InvType like '%sales%' AND not (d.Inv_No is  null or d.Inv_No like 'Ca%' or d.Inv_No  like 'no%') 
      AND d.Inv_Date='${date}' AND d.DC_Inv_No=d1.DC_Inv_No 
      Group By d.DC_Inv_No,d1.Material`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getStockDispatchSecondTable", async (req, res, next) => {
  let date = req.query.date;
  try {
    mtrlQueryMod(
      `SELECT d.DC_Inv_No,d.Inv_No, d.Inv_Date, d.Cust_Name, d.DC_InvType, 
    d1.Material, d1.Qty, d1.Unit_Wt, d1.DC_Srl_Wt, d1.Draft_dc_inv_DetailsID,d1.DC_Inv_Srl 
    FROM magodmis.draft_dc_inv_register d,magodmis.draft_dc_inv_details d1 
    WHERE d.DC_InvType like '%sales%' AND not (d.Inv_No is  null or d.Inv_No like 'Ca%' or d.Inv_No   like 'no%') 
    AND d.Inv_Date='${date}' AND d.DC_Inv_No=d1.DC_Inv_No`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getStockDispatchThirdTable", async (req, res, next) => {
  let date = req.query.date;
  try {
    mtrlQueryMod(
      `SELECT m.*FROM magod_mtrl.mtrl_sales m WHERE m.InvDate='${date}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.post("/insertStockDispatchMtrlSales", async (req, res, next) => {
  try {
    let { InvDate, Inv_No, Cust_Name, Material, DC_InvType, Dc_no, WeightOut } =
      req.body;
    mtrlQueryMod(
      `INSERT INTO magod_mtrl.mtrl_sales 
        (InvDate, Inv_No, Cust_Name, Material,DC_InvType,Dc_no, WeightOut)
        Values('${InvDate}', '${Inv_No}', '${Cust_Name}', '${Material}','${DC_InvType}','${Dc_no}', ${WeightOut}) 
        ON DUPLICATE KEY UPDATE  WeightOut=${WeightOut}`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

//Location Stock

storeRouter.get("/getLocationStockSecond", async (req, res, next) => {
  let location = req.query.location;
  try {
    mtrlQueryMod(
      `SELECT m.Cust_Code, m.Customer, m.Mtrl_Code, m.DynamicPara1,
      m.DynamicPara2, m.Scrap, Sum(m.Weight) as Weight, sum(m.ScrapWeight) as SWeight,
      m.LocationNo, count(m.MtrlStockID) as Quantity 
      FROM magodmis.mtrlstocklist m WHERE m.LocationNo='${location}' 
      GROUP BY m.Mtrl_Code, m.Cust_Code,  m.Customer,m.Scrap, m.DynamicPara1, m.DynamicPara2
      order by m.Mtrl_Code`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/getLocationStockThird", async (req, res, next) => {
  let location = req.query.location;
  let mtrlcode = req.query.mtrlcode;
  let para1 = req.query.para1;
  let para2 = req.query.para2;
  let custcode = req.query.custcode;
  let scrap = req.query.scrap;
  try {
    mtrlQueryMod(
      `SELECT * FROM magodmis.mtrlstocklist m 
      WHERE m.Mtrl_Code='${mtrlcode}' AND m.DynamicPara1=${para1} 
      AND m.DynamicPara2=${para2} AND m.Cust_Code=${custcode} 
      AND if(${scrap} ,m.Scrap, not m.Scrap) AND m.LocationNo='${location}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = storeRouter;

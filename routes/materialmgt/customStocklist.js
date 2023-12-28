const customStockList = require("express").Router();
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const { logger } = require("../../helpers/logger");

customStockList.get("/materialStockList1", async (req, res, next) => {
    try {
        
        let Cust_Code=req.query.Cust_Code;
       
    await  misQueryMod(
        `SELECT  m.Cust_Code, m1.Material,m.Customer, count(m.MtrlStockID) as Qty, sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2 WHERE m.Cust_Code="${Cust_Code}" AND  m.IV_No is  null   AND m2.Mtrl_Code=m.Mtrl_Code AND m1.MtrlGradeID=m2.MtrlGradeID and m1.Material=m.Material GROUP BY m.Material,m.Customer ORDER BY m.Material limit 20 `,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
         // console.log($(`SELECT  m.\`Cust_Code\`, m1.\`Material\`,m.\`Customer\`, count(m.\`MtrlStockID\`) as Qty, sum(m.\`Weight\`) as Weight, sum(m.\`ScrapWeight\`) as ScrapWeight FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2 WHERE m.\`Cust_Code\`="${Cust_Code}" AND m.\`IV_No\` is  null   AND m2.\`Mtrl_Code\`=m.\`Mtrl_Code\`AND m1.\`MtrlGradeID\`=m2.\`MtrlGradeID\` and m1.\`Material\`=m.\`Material\` GROUP BY m.\`Material\`,m.\`Customer\`ORDER BY m.\`Material\`limit 20 `));
        }
      );
    } catch (error) {
      next(error);
    }
  });

  customStockList.get("/materialStockList3", async (req, res, next) => {
    try {
        let Cust_Code=req.query.Cust_Code;
        console.log("Cust_Code",Cust_Code);
    await  misQueryMod(
        `SELECT m.Cust_Code,m.Mtrl_Code, m.DynamicPara1, m.Customer,m.DynamicPara2,m.DynamicPara3, m.Locked, m.Scrap, m1.Material, count(m.MtrlStockID) as Qty, Sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2 WHERE m.Cust_Code= "${Cust_Code}" AND m.IV_No is null AND m2.Mtrl_Code=m.Mtrl_Code AND m1.MtrlGradeID=m2.MtrlGradeID GROUP BY m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.Locked, m.Scrap,m1.Material,m.DynamicPara3,m.Customer ORDER BY m.Scrap Desc , m.Mtrl_Code limit 20 `,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  });

  customStockList.get("/materialStockList2", async (req, res, next) => {
    try {
        let Cust_Code=req.query.Cust_Code;
        console.log("Cust_Code",Cust_Code);
    await  misQueryMod(
        `SELECT m.Cust_Code,m.Mtrl_Code,m.Customer, m1.Material,count(m.MtrlStockID) as Qty, Sum(m.Weight) as Weight, sum(m.ScrapWeight) as ScrapWeight FROM magodmis.mtrlstocklist m,magodmis.mtrlgrades m1, magodmis.mtrl_data m2 WHERE m.Cust_Code= "${Cust_Code}" AND m.IV_No is null AND m2.Mtrl_Code=m.Mtrl_Code AND m1.MtrlGradeID=m2.MtrlGradeID GROUP BY m1.Material,m.Mtrl_Code,m.Customer ORDER BY m.Mtrl_Code limit 20 `,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  });
  module.exports = customStockList;
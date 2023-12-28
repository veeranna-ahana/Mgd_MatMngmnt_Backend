const ncprogrammtrlallotmentlistRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

ncprogrammtrlallotmentlistRouter.post(
  "/insertncprogrammtrlallotmentlist",
  async (req, res, next) => {
    try {
      let {
        TaskNo,
        NCProgramNo,
        ShapeMtrlID,
        Mtrl_Code,
        NCPara1,
        NCPara2,
        NCPara3,
        Para1,
        Para2,
        Para3,
        IssueId,
        NoReturn,
        Ncid,
      } = req.body;
      misQueryMod(
        `INSERT INTO magodmis.ncprogrammtrlallotmentlist 
          (TaskNo, NCProgramNo, ShapeMtrlID, Mtrl_Code,
          NCPara1, NCPara2, NCPara3, Para1, Para2, Para3, IssueId, NoReturn,Ncid) 
           VALUES('${TaskNo}', '${NCProgramNo}', '${ShapeMtrlID}', '${Mtrl_Code}',
          ${NCPara1}, ${NCPara2}, ${NCPara3}, ${Para1}, ${Para2}, ${Para3}, ${IssueId}, ${NoReturn},${Ncid})`,
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

ncprogrammtrlallotmentlistRouter.post(
  "/updatencprogrammtrlallotmentlistReturnStock",
  async (req, res, next) => {
    try {
      let { id } = req.body;
      misQueryMod(
        `UPDATE ncprogrammtrlallotmentlist n 
        SET n.ReturnToStock=-1
        WHERE n.NcPgmMtrlId=${id}`,
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

module.exports = ncprogrammtrlallotmentlistRouter;

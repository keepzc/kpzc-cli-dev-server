const { Controller } = require("egg");
const path = require("path");
const execSync = require("child_process").execSync;
const { failed } = require("../utils/request");
const PYTHON_CONNECT_SCRIPT_PATH = path.resolve(__dirname, "../../monitor/connect.py");

// format: 20230326
function createDatetime() {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + month + day;
}
class MonitorController extends Controller {
  async upload() {
    const { ctx } = this;
    const params = ctx.query;
    if (params) {
      let { appId, pageId, timestamp, ua, url, eventType } = params;
      let userId = params.user_id;
      let visitorId = params.visitor_id;
      if (appId && pageId && timestamp && ua && url && eventType) {
        // 1:appid
        // 2:pageid
        // 3:timestamp
        // 4:ua
        // 5:url
        // 6:args
        // 7:eventtype
        // 8:userId
        // 9:visitorId
        let datetime = createDatetime();
        let sql = `INSERT INTO kpzc_test.kpzc_monitor PARTITION (datetime = "${datetime}") VALUES (`;
        sql = `${sql}"${appId}",`;
        sql = `${sql}"${pageId}",`;
        sql = `${sql}"${timestamp}",`;
        sql = `${sql}"${ua}",`;
        sql = `${sql}"{}",`;
        sql = `${sql}"${url}",`;
        sql = `${sql}"${eventType}",`;
        sql = `${sql}"${userId}",`;
        sql = `${sql}"${visitorId}"`;
        sql = `${sql})`;
        const ret = execSync("python3 " + PYTHON_CONNECT_SCRIPT_PATH + ' "' + encodeURIComponent(sql) + '"'); // Buffer
        console.log(ret.toString());
        ctx.body = {
          appId,
          pageId,
          timestamp,
          ua,
          url,
          eventType,
          userId,
          visitorId
        };
      } else {
        ctx.body = failed("上传参数不全，请补充");
      }
    } else {
      ctx.body = failed("upload failed");
    }
  }
}

module.exports = MonitorController;

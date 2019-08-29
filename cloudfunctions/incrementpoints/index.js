const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const ACCESS_TOKEN = event.access_token;
  const userDoc = event.id;
  const amount = event.amount;

  let res = await rp({
    url: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      env: "minicafeenv",
      query: `db.collection(\"users\").doc(\"${userDoc}\").update({data:{points: _.inc(${amount})}})`
    },
    json: true
  });

  return {
    res
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const ACCESS_TOKEN = event.access_token;
  const productID = event.id;
  const newStatus = event.status;

  let res = await rp({
    url: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      env: "minicafeenv",
      query: `db.collection(\"products\").doc(\"${productID}\").update({data:{in_stock: ${newStatus}}})`
    },
    json: true
  });

  return {
    res
  }
}
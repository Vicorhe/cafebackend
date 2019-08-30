const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

exports.main = async (event, context) => {
  const ACCESS_TOKEN = event.access_token;
  const PRODUCT_ID = event.product_id;
  const NEW_STATUS = event.new_status;

  let res = await rp({
    url: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      env: "minicafeenv",
      query: `db.collection(\"products\").doc(\"${PRODUCT_ID}\").update({data:{in_stock: ${NEW_STATUS}}})`
    },
    json: true
  });

  return {
    res
  }
}
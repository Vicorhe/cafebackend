const cloud = require('wx-server-sdk');
const rp = require('request-promise');

cloud.init()

exports.main = async (event, context) => {
  const ACCESS_TOKEN = event.access_token;
  const USER_DOC_ID = event.user_doc_id;

  let res = await rp({
    url: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      env: "minicafeenv",
      query: `db.collection(\"users\").doc(\"${USER_DOC_ID}\").update({data:{vip: true}})`
    },
    json: true
  });

  return {
    res
  }
}
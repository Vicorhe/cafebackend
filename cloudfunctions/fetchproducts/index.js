const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

exports.main = async (event, context) => {
  const ACCESS_TOKEN = event.access_token;

  let res = await rp({
    url: `https://api.weixin.qq.com/tcb/databasequery?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      env: "minicafeenv",
      query: "db.collection(\"products\").limit(50).get()"
    },
    json: true
  });

  const data = res.data;
  
  return {
    data
  }
}
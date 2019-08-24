const cloud = require('wx-server-sdk');
const rp = require('request-promise');

cloud.init()

const APPID = 'wx6a3c4fc28fb3d43b';
const APPSECRET = '077f2ca5b12f1a3b476130ec405bcd4c';

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userDoc = event.id;

  let first_res = await rp({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: 'GET'
  });

  let xml = first_res.toString("utf-8");
  if (xml.indexOf('access_token') < 0) return {error: 'could not get access token'}; 

  const ACCESS_TOKEN = JSON.parse(xml).access_token;

  let second_res = await rp({
    url: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      env: "minicafeenv",
      query: `db.collection(\"users\").doc(\"${userDoc}\").update({data:{vip: true}})`
    },
    json: true
  });

  return {
    second_res,
  }
}
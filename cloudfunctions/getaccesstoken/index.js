const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

const APPID = 'wx6a3c4fc28fb3d43b';
const APPSECRET = '077f2ca5b12f1a3b476130ec405bcd4c';

exports.main = async (event, context) => {
  let res = await rp({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: 'GET'
  });

  let xml = res.toString("utf-8");
  const response = JSON.parse(res);
  
  return {
    response
  }
}
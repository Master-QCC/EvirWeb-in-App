/* jshint esversion: 6 */
import axios from 'axios';
import qs from 'qs'; /*解析axios传参的数据格式*/

axios.defaults.baseURL = BASE_URL; // 后台接口公共前缀.在config中配置url
axios.defaults.timeout = 3000;

function request(url, params, methods, needToken = true) {
  let evirToken = localStorage.getItem('evirToken');
  let config = {
    method: methods,
    url: url,
    headers: {}
  };

  methods === 'GET' ? config.params = params : config.data = qs.stringify(params);

  if (needToken && evirToken) {
    config.headers.token = evirToken;
  }
  let promise = new Promise((resolve, reject) => {
    axios(config).then( res => {
      resolve(res);
    }).catch( err => {
      reject(err);
    });
  });

  return promise;
}

export default {
  request: request
};

/* jshint esversion: 6 */
import axiosCall from './axiosCall.js';

export default {
  //get data
  getUserData(data) {
    const url = '/login/jfssoLogin';
    return axiosCall.request(url, data, 'POST', false);
  },
  getCarListData(data) {
    const url = '/vehicle/getPlateNumberByPhone';
    return axiosCall.request(url, data, 'GET');
  },
  getCheckData(data) {
    const url = '/vehicle/getInspectState';
    return axiosCall.request(url, data, 'GET');
  },
  getRecordData(data) {
    const url = '/vehicle/getInspectStatis';
    return axiosCall.request(url, data, 'GET');
  },
  getCheckItem(data) {
    const url = '/position/getLevelTwoByPlateNumberAndLevelOneId';
    return axiosCall.request(url, data, 'GET');
  },
  //bind NFC tag
  bindNFCTag(data) {
    const url = '/position/addLabelPosition';
    return axiosCall.request(url, data, 'POST');
  },
  //submit data
  submitTagError(data) {
    const url = '/vehicle/addInspectRecord';
    return axiosCall.request(url, data, 'GET');
  }
};

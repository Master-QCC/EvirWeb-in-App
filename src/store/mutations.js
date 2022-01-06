/* jshint esversion: 6 */
const mutation = {
  set_userType (state, value) {
    state.userType = value;
  },
  set_userInfo (state, value) {
    state.userInfo = value;
  },
  set_carList (state, value) {
    state.carList = value;
  },
  set_plate (state, value) {
    state.plate = value;
  },
  set_login (state, value) {
    state.isLogin = value;
  },
  set_tabIndex (state, value) {
    state.tabIndex = value;
  },
  set_checkList (state, value) {
    state.checkList = value;
  }
};
export default mutation;

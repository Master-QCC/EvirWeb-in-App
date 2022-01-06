/* jshint esversion: 6 */
import Vue from "vue";
import App from "./App";
import * as echarts from "echarts";
import router from "./router";
import store from "./store";
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Cell,
  CellGroup,
  Calendar,
  Field,
  Picker,
  Notify,
  Toast,
  Popup,
  Overlay,
  Swipe,
  SwipeItem,
  Lazyload,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Dialog
} from "vant";

Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Calendar);
Vue.use(Field);
Vue.use(Picker);
Vue.use(Notify);
Vue.use(Toast);
Vue.use(Popup);
Vue.use(Overlay);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Dialog);

Vue.prototype.$echarts = echarts;

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

function onPlusReady(callback, context = this) {
  if (window.plus) {
    callback.call(context);
  } else {
    document.addEventListener("plusready", callback.bind(context));
  }
}

Vue.mixin({
  beforeCreate() {
    onPlusReady(() => {
      this.plusReady = true;
    }, this);
  },

  methods: {
    onPlusReady: onPlusReady
  }
});

Vue.config.productionTip = false; /*开发者生产提示*/

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});

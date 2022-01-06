/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import Common from '@/utils/help.js';
import Index from '@/pages/index';
import Statistics from '@/pages/statistics';
import Details from '@/pages/details';
import My from '@/pages/my';
import TagError from '@/pages/tagError';
import Check from '@/pages/check';

Vue.prototype.$common = Common;
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    }, {
      path: '/index',
      name: 'Index',
      component: Index,
      meta: {
        title: '首页',
        showTab: true,
        routerIndex: 0
      }
    }, {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics,
      meta: {
        title: '统计',
        showTab: true,
        routerIndex: 0
      }
    }, {
      path: '/details',
      name: 'Details',
      component: Details,
      meta: {
        title: '详情',
        showTab: false,
        routerIndex: 1
      }
    }, {
      path: '/my',
      name: 'My',
      component: My,
      meta: {
        title: '我的',
        showTab: true,
        routerIndex: 0
      }
    }, {
      path: '/tagError',
      name: 'TagError',
      component: TagError,
      meta: {
        title: '标签异常提交',
        showTab: false,
        routerIndex: 1
      }
    }, {
      path: '/check',
      name: 'Check',
      component: Check,
      meta: {
        title: '检查详情',
        showTab: false,
        routerIndex: 1
      }
    }
  ]
});

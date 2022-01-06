<template>
  <div id="app" :class="themeValue">
    <van-nav-bar left-arrow @click-left="onClickLeft">
      <template #title>
        <p name="title">{{ navTitle }}</p>
      </template>
    </van-nav-bar>
    <transition :name="transitionName">
      <keep-alive :include="['Index', 'Statistics']" :exclude="['My', 'TagError', 'Details', 'Check']">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <van-tabbar
      v-model="active"
      active-color="#0972E7"
      inactive-color="#393c43"
      @change="onChange"
      v-show="$route.meta.showTab"
    >
      <van-tabbar-item placeholder to="/index">
        <span>首页</span>
        <template #icon="props">
          <img :src="props.active ? indexIcon.active : indexIcon.inactive" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item placeholder to="/statistics">
        <span>统计</span>
        <template #icon="props">
          <img :src="props.active ? statisticsIcon.active : statisticsIcon.inactive"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item placeholder to="/my">
        <span>我的</span>
        <template #icon="props">
          <img :src="props.active ? myIcon.active : myIcon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import api from "@/utils/api.js";

export default {
  name: "App",
  data() {
    return {
      themeValue: "",
      transitionName: "",
      active: 0,
      navTitle: "首页",
      routerIndex: 0,
      indexIcon: {
        active: require("./assets/icon/index-active.svg"),
        inactive: require("./assets/icon/index.svg")
      },
      statisticsIcon: {
        active: require("./assets/icon/statistics-active.svg"),
        inactive: require("./assets/icon/statistics.svg")
      },
      myIcon: {
        active: require("./assets/icon/my-active.svg"),
        inactive: require("./assets/icon/my.svg")
      }
    };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.meta.routerIndex;
      const fromDepth = from.meta.routerIndex;
      this.routerIndex = toDepth;
      this.navTitle = to.meta.title;

      if (toDepth !== fromDepth) {
        this.transitionName =
          toDepth > fromDepth ? "slide-left" : "slide-right";
      } else {
        this.transitionName = "";
      }
    },
    active(newVal, oldVal) {
      this.onChange(newVal);
    }
  },
  methods: {
    getUserCarList(phoneNumber) {
      api.getCarListData({ phone: phoneNumber })
        .then(res => {
          this.$store.commit("set_carList", res.data);
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$notify({
            message: "获取车辆列表失败",
            duration: 1500
          });
          console.log(err);
        });
    },
    getUserInfo(query) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "加载中"
      });
      api.getUserData({ phone: query.phoneNumber })
        .then(res => {
          window.localStorage.setItem("evirToken", res.data.token);
          this.$store.commit("set_userInfo", res.data.user);
          this.$store.commit("set_login", true);
          this.getUserCarList(query.phoneNumber);
        })
        .catch(err => {
          this.$toast.clear();
          this.$notify({
            message: "获取用户信息失败",
            duration: 1500
          });
          console.log(err);
        });
    },
    checkQuery(query) {
      if (query.userType && query.phoneNumber && query.plateNumber) {
        this.getUserInfo(query);
        this.themeValue = query.userType;
        this.$store.commit("set_userType", query.userType);
        this.$store.commit("set_plate", query.plateNumber);
      } else {
        this.$notify({
          message: "用户信息有误，请重新进入",
          duration: 1500,
          type: "warning"
        });
      }
    },
    onChange(index) {
      this.$store.commit("set_tabIndex", index);
    },
    onClickLeft() {
      if (this.routerIndex > 0) {
        this.$router.go(-1);
      } else {
        console.log("exit web");
        window.finishWebView_Android.closeActivity();
      }
    },
    setNavBarTitle(titleText) {
      this.navTitle = titleText;
    }
  },
  mounted() {
    const query = this.$route.query;
    this.checkQuery(query);
  }
};
</script>

<style lang="scss">
@import "./assets/css/index";

.van-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #eef0f3;
  z-index: 10;

  .van-nav-bar__title {
    font-size: 1.2rem;
    color: #393c43;
  }
  .van-nav-bar__left {
    .van-nav-bar__arrow {
      font-size: 1.5rem;
      color: #393c43;
    }
  }
}
.van-tabbar {
  background-color: rgba(57, 60, 67, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
  padding: .5rem 0; //兼容全面屏底部小横条

  .van-tabbar-item {
    font-size: 14px;
    background-color: transparent;

    .van-tabbar-item__icon img {
      width: 24px;
      height: auto;
    }
  }
}

// change page animation
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 0.5s;
  position: fixed;
  width: calc(100% - 2rem);
}
.slide-right-enter {
  opacity: 0;
  transform: translateX(0);
  width: calc(100% - 2rem);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-enter {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translateX(0);
}

//toggle item/component animation
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

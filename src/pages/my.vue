<template>
  <div class="my-section">
    <plateHeader class="plate-header"></plateHeader>
    <div class="today">{{ today }}</div>

    <div class="flex user-info-box">
      <div class="user-info">
        <div
          class="info-item"
          v-for="(item, index) in userInfoList"
          :key="index"
        >
          <div class="flex title">
            <img class="icon" :src="item.icon" alt="truck image" />
            <span>{{ item.title }}：</span>
          </div>
          <div v-if="Array.isArray(item.value)">
            <p class="value" v-for="(carItem, index) in item.value" :key="index">{{ carItem.plateNumber }}</p>
          </div>
          <p class="value" v-else>{{ item.value }}</p>
        </div>
      </div>
      <div class="image-box">
        <img class="image" src="../assets/image/truck.png" alt="truck image" />
      </div>
    </div>

    <div class="function-section">
      <div class="title">更多</div>
      <div class="flex function-list">
        <div
          class="item function-item"
          v-for="(item, index) in functionList"
          :key="index"
        >
          <div class="inner flex" @click="bindFun(item.functionName, index)" >
            <img class="icon" :src="item.icon" alt="button icon" />
            <p class="text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <van-popup
      v-model="showPopup"
      closeable
      round
      close-icon-position="top-right"
      position="bottom"
      class="popup-section"
    >
    <p class="title">{{popupTitle}}</p>
    <div class="chart-box week" v-if="popUpType === 'weekReport'">
      <weekReport :lineData="lineData"></weekReport>
    </div>
    <div class="chart-box month" v-else-if="popUpType === 'monthReport'">
      <monthReport></monthReport>
    </div>
    <div class="chart-box score" v-else-if="popUpType === 'vehicleScore'">
      <div class="flex wrapper">
        <vehicleScore :scoreData="scoreData"></vehicleScore>
      </div>
      <div class="item-stauts">
        <p class="title">当前状态</p>
        <ul class="flex stauts-list">
          <li class="item" v-for="(item, index) in stautsList" :key="index">
            <div class="flex" v-if="item.stauts === 1">
              <div class="image-box flex checked">
                <img class="icon" src="../assets/icon/index/checked.svg" alt="checked icon">
              </div>
              <div class="content">
                <p class="text">右侧前轴附近</p>
                <span class="stauts">正常</span>
              </div>
            </div>

            <div class="flex" v-else-if="item.stauts === 2">
              <div class="image-box flex error">
                <img class="icon" src="../assets/icon/index/error.svg" alt="checked icon">
              </div>
              <div class="content">
                <p class="text">右侧前轴附近</p>
                <div class="flex">
                  <span class="stauts">异常</span>
                  <span class="score">-10</span>
                </div>
              </div>
            </div>

            <div class="flex" v-else-if="item.stauts === 3">
              <div class="image-box flex break">
                <img class="icon" src="../assets/icon/index/break.svg" alt="checked icon">
              </div>
              <div class="content">
                <p class="text">前部</p>
                <div class="flex">
                  <span class="stauts">损坏</span>
                  <span class="score">-15</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </van-popup>

  </div>
</template>

<script>
import weekReport from "@/components/weekReport";
import monthReport from "@/components/monthReport";
import vehicleScore from "@/components/vehicleScore";
import plateHeader from "@/components/plateHeader"

export default {
  name: "My",
  components: {
    weekReport,
    monthReport,
    vehicleScore,
    plateHeader
  },
  data() {
    return {
      today: "",
      showPopup: false,
      userInfoList: [
        {
          icon: require("../assets/icon/my/organization.svg"),
          title: "机构",
          value: ""
        },
        {
          icon: require("../assets/icon/my/info.svg"),
          title: "姓名",
          value: ""
        },
        {
          icon: require("../assets/icon/my/phone.svg"),
          title: "手机号",
          value: ""
        },
        {
          icon: require("../assets/icon/my/car.svg"),
          title: "绑定车牌",
          value: []
        }
      ],
      functionList: [
        {
          icon: require("../assets/icon/my/check-btn.svg"),
          functionName: "weekReport",
          text: "一周详情"
        }, {
          icon: require("../assets/icon/my/check-list.svg"),
          functionName: "monthReport",
          text: "月度异常"
        }, {
          icon: require("../assets/icon/my/score.svg"),
          functionName: "vehicleScore",
          text: "车辆评分"
        }
      ],
      popupTitle: '',
      popUpType: '',
      scoreData: 75,
      lineData: {
        daysList: ["11/30", "12/01", "12/02", "12/03", "12/04", "12/05", "12/06"],
        abnormalCountList: [0, 0, 2, 0, 0, 0, 0],
        normalCountList: [0, 0, 7, 0, 0, 0, 0],
        missedInspectList: [550, 550, 541, 550, 550, 550, 550],
        labelExCountList: [0, 0, 0, 0, 0, 0, 0]
      },
      stautsList: []
    };
  },
  methods: {
    bindFun (functionName, index) {
      this.popupTitle = this.functionList[index].text;
      this.showPopup = true;
      this.popUpType = functionName;
      switch (index) {
        case 0:
          this.getWeekData();
          break;
        case 1:
          this.getMonthData();
          break;
        case 2:
          this.getScoreData();
          break;
        default:
          return;
      }
    },
    getWeekData() {
      console.log('getWeekData()');
    },
    getMonthData() {
      console.log('getMonthData()');

    },
    getScoreData() {
      console.log('getScoreData()');

    }
  },
  mounted() {
    console.log('my');
    if (this.$store.state.isLogin) {
      this.today = this.$common.getDate().todayInWeekValue;
      this.userInfoList[0].value = this.$store.state.userInfo.organizationName;
      this.userInfoList[1].value = this.$store.state.userInfo.name;
      this.userInfoList[2].value = this.$store.state.userInfo.phone;
      this.userInfoList[3].value = this.$store.state.carList;
    }
    this.stautsList = [
      {
        stauts: 1
      },{
        stauts: 2
      },{
        stauts: 1
      },{
        stauts: 1
      },{
        stauts: 1
      },{
        stauts: 3
      },
    ]
  }
};
</script>

<style lang="scss" scoped>
.my-section {
  padding-bottom: 3rem;
  .today {
    font-weight: bold;
    margin-top: .5rem;
    margin-bottom: 1.5rem;
  }

  .user-info-box {
    align-items: center;
    margin-bottom: 1.5rem;
    .user-info {
      padding-right: 1rem;
      width: 50%;
    }

    .user-info {
      .info-item {
        padding: 1rem 0;
        border-bottom: 1px solid #cccccc;

        &:first-child {
          padding-top: 0;
        }

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .title {
          align-items: center;
        }

        .icon {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.5rem;
        }

        .value {
          line-height: 1.2;
          font-weight: bold;
          font-size: 1.2rem;
          padding-left: 2rem;
        }
      }
    }

    .image-box {
      width: 50%;
      .image {
        width: 200%;
      }
    }
  }

  .function-section {
    .title {
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .function-list {
      flex-wrap: wrap;
      justify-content: space-between;
      .function-item {
        width: calc(50% - 0.5rem);

        .inner {
          flex-direction: column;
          align-items: center;

          &:active {
            box-shadow: inset 0px 0px 20px #c7c7c7;
          }

          .icon {
            width: 2rem;
            height: 2rem;
            margin-bottom: 0.75rem;
          }

          .text {
            font-size: 0.875rem;
          }
        }
      }
    }
  }

  .popup-section {
    padding: 1rem 1rem 2rem 1rem;
    overflow: hidden;

    .title {
      font-size: 1.2rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1rem;
    }

    /deep/ .van-popup__close-icon {
      color: #393C43;
      font-weight: bold
    }

    .chart-box {
      &.score {
        .wrapper {
          align-items: center;
          justify-content: center;
          height: 260px;
          overflow: hidden;
        }

        .title {
          text-align: left;
          margin-bottom: 0;
        }

        .stauts-list {
          flex-wrap: wrap;
          .item {
            background: transparent;
            border-radius: 0;
            padding: 1rem 0;
            border-bottom: 1px solid #c7c7c7;
            margin-bottom: 0;
            align-items: center;
            justify-content: flex-start;
            width: calc(50% - .5rem);

            &:nth-child(odd) {
              margin-right: 1rem;
            }

            &:last-child, &:nth-last-child(-n + 2) {
              margin-bottom: 0;
            }

            .image-box {
              align-items: center;
              padding: .5rem;
              border-radius: .5rem;
              margin-right: .5rem;

              .icon {
                width: 1.5rem;
                height: 1.5rem;
              }

              &.checked {
                color: #fff;
                background: linear-gradient(90deg, #47D16C 0%, #00B02F 100%);
              }

              &.error {
                color: #fff;
                background: linear-gradient(90deg, #FF2121 0%, #C60000 100%);
              }

              &.break {
                color: #fff;
                background: linear-gradient(90deg, #AC02E4 0%, #48008b 100%);
              }
            }

            .content {
              width: 100%;
              .text {
                font-weight: bold;
                margin-bottom: .5rem;
              }

              .flex {
                align-items: center;
                justify-content: space-between;
              }
              .stauts {
                font-size: .75rem;
                opacity: .5;
              }

              .score {
                font-weight: bold;
                color: #ff2121;
              }
            }
          }
        }
      }
    }
  }

}
</style>

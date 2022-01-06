<template>
  <div class="statistics-section">
    <plateHeader class="plate-header"></plateHeader>

    <div class="time-selection">
      <p class="time-title">日期选择</p>
      <van-radio-group v-model="timeRadio">
        <button
          :class="['time-btn', activeSeven ? 'active' : '']"
          @click="sevenDaysSearch()"
        >
          近7天
        </button>
        <button
          :class="['time-btn', activeMonth ? 'active' : '']"
          @click="oneMonthsSearch()"
        >
          近1月
        </button>
      </van-radio-group>
      <van-cell
        class="calendar-selector"
        :value="dateText"
        @click="showCalendar = true"
      />
      <van-calendar
        v-model="showCalendar"
        :min-date="minDate"
        :max-date="maxDate"
        type="range"
        @confirm="onConfirm"
        :show-confirm="false"
        color="#003DE3"
      />
      <button class="button search-btn" type="primary" @click="search()">
        搜索
      </button>
    </div>

    <div class="result-section">
      <p class="result-title">环检记录</p>
      <div class="item" v-if="recordList.length > 0">
        <div class="inner">
          <table class="result-list">
            <tr class="table-header">
              <th>日期</th>
              <th>位置</th>
              <th width="80">操作</th>
            </tr>
            <tr v-for="(item, index) in recordList" :key="index">
              <td class="bold">{{ item.inspectDate }}</td>
              <td>{{ item.levelOneName }}</td>
              <td>
                <router-link
                  class="detail-btn"
                  :to="{
                    path: '/details',
                    query: {
                      levelOneName: item.levelOneName,
                      detailList: item.detailList
                    }
                  }" >详情<i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i></router-link>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-else class="flex result-null">
        <img
          class="icon"
          src="../assets/image/empty-data.png"
          alt="empty icon"
        />
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api.js";
import plateHeader from "@/components/plateHeader";
export default {
  name: "Statistics",
  components: {
    plateHeader
  },
  data() {
    return {
      dateText: "",
      startDate: "",
      endDate: "",
      showCalendar: false,
      recordList: [],
      activeSeven: false,
      activeMonth: false
    };
  },
  computed: {
    minDate() {
      return new Date(this.$common.getDay(-30));
    },
    maxDate() {
      return new Date(this.$common.getDate().currentdate);
    }
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    sevenDaysSearch() {
      this.activeSeven = !this.activeSeven;
      this.activeMonth = false;

      if (this.activeSeven) {
        let date = [
          new Date(this.$common.getDay(-7)),
          new Date(this.$common.getDate().currentdate)
        ];
        this.onConfirm(date, "trigger");
        this.search();
      } else {
        this.dateText = "";
      }
    },
    oneMonthsSearch() {
      this.activeMonth = !this.activeMonth;
      this.activeSeven = false;
      if (this.activeMonth) {
        let date = [
          new Date(this.$common.getDay(-30)),
          new Date(this.$common.getDate().currentdate)
        ];
        this.onConfirm(date, "trigger");
        this.search();
      } else {
        this.dateText = "";
      }
    },
    onConfirm(date, type) {
      const [start, end] = date;
      this.showCalendar = false;
      if (!type || type !== "trigger") {
        this.activeSeven = false;
        this.activeMonth = false;
      }
      this.dateText = `${this.formatDate(start)} 至 ${this.formatDate(end)}`;
      this.startDate = `${this.formatDate(start)}`;
      this.endDate = `${this.formatDate(end)}`;
    },
    search() {
      let data = {
        startTime: this.startDate,
        endTime: this.endDate,
        phone: this.$store.state.userInfo.phone,
        plateNumber: this.$store.state.plate
      };

      if (data.startTime && data.endTime) {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: "请求中"
        });
        api.getRecordData(data)
          .then(res => {
            if (res.data.length > 0) {
              this.recordList = res.data;
              this.$toast.clear();
            } else {
              this.$toast.clear();
              this.recordList = [];
            }
          })
          .catch(err => {
            this.$toast.clear();
            this.recordList = [];
            this.$notify({
              message: "获取环检记录失败",
              duration: 1500
            });
            console.log(err);
          });
      } else {
        this.$notify({
          message: "请选择日期区间",
          type: "warning",
          duration: 1500
        });
      }
    }
  },
  mounted() {
    console.log("st");
    if (this.$store.state.isLogin) {
      this.sevenDaysSearch(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.statistics-section {
  padding-bottom: 3rem;
  .plate-header {
    margin-bottom: 1.5rem;
  }

  .time-selection {
    margin-bottom: 1.5rem;

    .time-title {
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .calendar-selector {
      margin-bottom: 1rem;

      .van-cell__title {
        flex: none;
        color: #969799;
      }

      .van-cell__value {
        font-weight: bold;
        font-size: 1.2rem;
        color: #393c43;
        line-height: 1;
        min-height: 1.2rem;
      }
    }
  }

  .time-btn {
    color: #5d6167;
    padding: 0.5rem 1.5rem;
    background-color: transparent;
    border: 1px solid #acafb4;
    border-radius: 2rem;
    margin-right: 1rem;
    margin-bottom: 1rem;

    &.active {
      color: #fff;
      font-weight: bold;
      border-color: #003de3;
      background: linear-gradient(135deg, #3771ff 0%, #003de3 100%);
    }
  }

  .result-section {
    .inner {
      overflow: hidden;
      padding: 0;
    }
    .result-title {
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .result-list {
      .table-header {
        background-color: #003de3;
        color: #fff;
        th {
          padding: 1rem;
        }
      }
      tr {
        &:first-child {
          td {
            padding-top: 0;
          }
        }

        td {
          &:first-child {
            padding-left: 1rem;
          }
          &:last-child {
            text-align: right;
            padding-right: 1rem;
          }
        }

        .bold {
          font-weight: bold;
        }

        .detail-btn {
          padding: 0.5rem 0.5rem 0.5rem 0.75rem;
          border-radius: 1rem;
          background: #d1d3d7;

          .van-icon {
            transform: rotate(180deg);
            margin-right: 0;
            vertical-align: bottom;
          }
        }
      }
    }

    .result-null {
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 3rem 0;
      color: rgba($color: #393c43, $alpha: 0.76);

      .icon {
        width: 50vw;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>

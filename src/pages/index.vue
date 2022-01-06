<template>
  <div class="index-section">
    <plateHeader></plateHeader>

    <div class="reading-section flex">
      <div class="reading-btn">
        <div class="circle circle-bottom" @click="readingNFC()">
          <div class="circle circle-middle">
            <div class="circle flex circle-top">
              {{ readingText }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="data">{{ nfcdata }}</div>

    <div class="result-section">
      <p class="result-title">环检类别</p>
      <div class="item" v-if="checkItemList.length > 0">
        <ul class="flex inner result-list">
          <li
            class="result-item"
            v-for="(item, index) in checkItemList"
            :key="index"
            @click="showItemStatus(item.inspectStatus)"
          >
            <div class="flex content checked" v-if="item.inspectStatus === 1">
              <img class="icon" src="../assets/icon/index/checked.svg" />
              <span class="item-name">{{ item.name }}</span>
            </div>

            <div
              class="flex content error"
              v-else-if="item.inspectStatus === 2"
            >
              <img class="icon" src="../assets/icon/index/error.svg" />
              <span class="item-name">{{ item.name }}</span>
            </div>

            <div
              class="flex content break"
              v-else-if="item.inspectStatus === 3"
            >
              <img class="icon" src="../assets/icon/index/break.svg" />
              <span class="item-name">{{ item.name }}</span>
            </div>

            <div class="flex content" v-else>
              <span class="item-name">{{ item.name }}</span>
            </div>
          </li>
        </ul>
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

    <van-overlay
      class="flex van-overlay"
      :show="showOverlay"
      @click="showOverlay = false">
      <div class="overlay-wrapper" @click.stop>
        <img
          class="close-btn"
          src="../assets/icon/close.svg"
          alt="close-icon" @click="showOverlay = false" />
        <div class="selection">
          <p class="title">请确认当前扫描标签的位置</p>
          <van-field
            class="location-field"
            readonly
            clickable
            :value="value"
            placeholder="选择位置"
            @click="showPicker = true">
          </van-field>
          <button :disabled="!valueId" class="button submit-btn" type="primary" @click="bindTag()">确定</button>
        </div>
      </div>
    </van-overlay>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        visible-item-count="4"
        :columns="checkList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import api from "@/utils/api.js";
import plateHeader from "@/components/plateHeader"
export default {
  name: "Index",
  components: {
    plateHeader
  },
  data() {
    return {
      readingText: "点击读取",
      checkItemList: [],
      notifyText: "",
      //nfc data
      waiting: "",
      nfcdata: "",
      readyRead: false,
      NfcAdapter: "",
      NdefRecord: "",
      NdefMessage: "",
      //dropdown
      checkList:[],
      value: '',
      valueId: '',
      showPicker: false,
      showOverlay: false
    };
  },
  watch: {
    "$store.state.isLogin": {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getCheckItemList();
        }
      }
    },
    showOverlay(newVal, oldVal) {
      if (!newVal) {
        this.value = '';
        this.valueId = '';
      }
    }
  },
  methods: {
    getCheckItemList() {
      const plate = this.$store.state.plate;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "请求中"
      });

      api.getCheckData({ plateNumber: plate })
        .then(res => {
          this.checkItemList = res.data;
          this.$store.commit("set_checkList", res.data);
          this.getCheckDropdown(res.data);
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$notify({
            message: "获取环检列表失败",
            duration: 1500
          });
          console.log(err);
        });
    },
    getCheckDropdown(data) {
      let length = data.length;
      let columnArry = [];
      for (let i = 0; i < length; i++) {
        columnArry.push(data[i].name)
      }
      this.checkList = columnArry;
    },
    showItemStatus(inspectStatus) {
      switch (inspectStatus) {
        case 1:
          this.notifyText = "此项检测正常";
          break;
        case 2:
          this.notifyText = "此项检测异常";
          break;
        case 3:
          this.notifyText = "此项标签异常";
          break;
        default:
          this.notifyText = "此项未检查";
      }

      this.$toast({
        message: this.notifyText
      });
    },
    onConfirm(value) {
      this.value = value;
      let index = this.checkList.indexOf(value);
      this.valueId = this.$store.state.checkList[index].id;
      this.showPicker = false;
    },
    readingNFC() {
      this.showOverlay = true;
      // this.$router.push({path:'/tagError'});
    },
    bindTag() {
      console.log('bindTag');
      //to do
      this.$router.push({path: '/check', query:{ title: this.value, titleId: this.valueId, hardwareId: '0000001'}});
      return;
      let data = {
        organizationId: this.$store.state.userInfo.organizationId,
        userType: this.$store.state.userInfo.userType,
        levelOneId: this.$route.query.titleId,
        plateNumber: this.$store.state.plate,
        hardwareId: this.$route.query.hardwareId
      };

      api.bindNFCTag(data)
      .then(res => {
        if (res.data.code === 200) {
          this.$router.push({path: '/check', query:{ title: this.value, titleId: this.valueId, hardwareId: '0000001'}});
          this.showOverlay = false;
        } else {
          this.$notify({
            message: res.data.message,
            duration: 1500
          });
        }
      })
      .catch(err => {
        this.$notify({
          message: "绑定NFC位置失败，请重新提交",
          duration: 1500
        });
        console.log(err);
      });
    }
  },
  mounted() {
    console.log("index");
    if (window.plus) {
      this.listenNFCStatus();
    } else {
      document.addEventListener("plusready", this.listenNFCStatus, false);
    }
  },
  activated() {
    if (this.$store.state.isLogin) {
      this.getCheckItemList();
    }
  }
};
</script>

<style lang="scss" scoped>
.index-section {
  padding-bottom: 3rem;

  .reading-section {
    position: relative;
    justify-content: center;
    align-items: center;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 40%;
      width: 100%;
      height: 100%;
      background: url("../assets/image/truck.png") no-repeat;
      background-size: cover;
      opacity: 0.6;
      z-index: 0;
    }

    .reading-btn {
      width: 220px;
      height: 220px;
      box-sizing: content-box;
      padding: 3rem 0;
      z-index: 1;

      .circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;

        &.circle-bottom {
          background: linear-gradient(
            90deg,
            rgba(55, 113, 255, 0.3),
            rgba(0, 61, 227, 0.3)
          );
          padding: 0.8rem;
        }

        &.circle-middle {
          background: linear-gradient(
            90deg,
            rgba(55, 113, 255, 0.5),
            rgba(0, 61, 227, 0.5)
          );
          padding: 0.8rem;
        }

        &.circle-top {
          background: linear-gradient(90deg, #3771ff, #003de3);
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .result-section {
    .result-title {
      font-weight: bold;
      margin-bottom: 1rem;
    }

    .result-list {
      width: 100%;
      padding: 0.5rem;
      flex-wrap: wrap;
      box-sizing: border-box;

      .result-item {
        width: 50%;
        padding: 0.5rem;
        font-size: 0.75rem;

        .content {
          border-radius: 2rem;
          padding: 1rem 0;
          justify-content: center;
          background: linear-gradient(
            270deg,
            rgba(57, 60, 67, 0.12) 0%,
            rgba(57, 60, 67, 0.3) 100%
          );
          align-items: center;

          &.checked {
            color: #fff;
            background: linear-gradient(90deg, #47d16c 0%, #00b02f 100%);
          }

          &.error {
            color: #fff;
            background: linear-gradient(90deg, #ff2121 0%, #c60000 100%);
          }

          &.break {
            color: #fff;
            background: linear-gradient(90deg, #ac02e4 0%, #48008b 100%);
          }

          .icon {
            width: 1rem;
            height: 1rem;
            margin-right: 4px;
          }
        }

        &:nth-child(3n) {
          margin-right: 0;
        }

        .item-name {
          opacity: 0.7;
        }
      }
    }

    .result-null {
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem 0;
      color: rgba($color: #393c43, $alpha: 0.76);

      .icon {
        width: 50vw;
        margin-bottom: 1rem;
      }
    }
  }

  .van-overlay {
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;

    .overlay-wrapper {
      position: relative;
      background: #fff;
      padding: 1rem;
      border-radius: 1rem;
      width: 100%;
      background: linear-gradient(0deg, #f9f9f9 0%, #dee1e7 100%);
      box-shadow: 0px 12px 12px -4px #222429;

      .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .title {
        font-weight: bold;
        margin-bottom: 1rem;
      }

      .location-field {
        position: relative;
        font-size: 1.2rem;
        padding: 1rem;
        background-color: #CBCED3;
        border-radius: 1.5rem;
        margin-bottom: 1rem;
        color: #393C43;

        &:after {
          position: absolute;
          display: block;
          right: 1rem;
          left: unset;
          bottom: .35rem;
          content: '';
          width: 0;
          height: 0;
          border: .5rem solid transparent;
          border-top: .5rem solid #fff;
          transform: none;
        }
        &:before {
          position: absolute;
          display: block;
          right: 1rem;
          top: .35rem;
          content: '';
          width: 0;
          height: 0;
          border: .5rem solid transparent;
          border-bottom: .5rem solid #fff;
        }

        /deep/ .van-field__control {
          font-size: 1rem;
          line-height: 1;
        }

        /deep/ input::-webkit-input-placeholder {
          color: #a7a7a8;
        }
      }

    }
  }

  .item-notify {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50vh);
    padding: 1rem;
    border-radius: 1rem;
    color: #fff;
    background-color: rgba($color: #000000, $alpha: 0.7);
    opacity: 0;
    transition: all 0.3s;

    &.show {
      display: block;
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
}
</style>

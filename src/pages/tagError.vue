<template>
  <div class="tagError-section">
    <div class="flex tagError-title">
      <div class="flex"><img class="icon" src="../assets/icon/tagError/tag-error.svg" alt="" /></div>
      读取失败
    </div>

    <div
      class="item error-content"
      v-for="(item, index) in errorContentList"
      :key="index"
    >
      <div class="inner">
        <div class="flex header">
          <div class="title">{{ index + 1 }}. {{ item.title }}</div>
          <a href="weixin://" class="button func-btn" v-if="index === 0">{{
            item.btnText
          }}</a>
          <button
            v-else-if="index === 2"
            class="button func-btn"
            type="primary"
            @click="showOverlay = true"
          >
            {{ item.btnText }}
          </button>
        </div>
        <p class="content">{{ item.content }}</p>
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
          <p class="title">{{errorContentList[2].btnText}}</p>
          <van-field
            class="location-field"
            readonly
            clickable
            :value="value"
            placeholder="选择位置"
            @click="showPicker = true">
          </van-field>
          <p class="title">描述</p>
          <van-field
            class="location-textarea"
            v-model="remarks"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入异常描述">
          </van-field>
          <button class="button submit-btn" type="primary" @click="submitError()">提交</button>
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

    <button class="button back-btn" type="primary" @click="backIndex()">重新读取</button>
  </div>
</template>

<script>
export default {
  name: "TagError",
  data() {
    return {
      date: "",
      errorContentList: [
        {
          title: "NFC开启",
          content:
            "请确保您的手机NFC功能处于开启状态，您可在手机的 系统设置 -> NFC 中确认是否开启",
          needBtn: true,
          btnText: "前往设置",
          functionName: ""
        },
        {
          title: "位置调整",
          content:
            "如您确认NFC功能已开启但仍无法扫描成功，请调整手机位置再次读取，NFC可能位于中部或上部。",
          needBtn: false,
          btnText: "",
          functionName: ""
        },
        {
          title: "异常上报",
          content: "如多次无法读取，标签损坏/丢失，请点击 标签异常上报",
          needBtn: true,
          btnText: "标签异常"
        }
      ],
      showOverlay: false,
      value: '',
      valueId: '',
      showPicker: false,
      remarks: ''
    };
  },
  computed: {
    checkList() {
      let length = this.$store.state.checkList.length;
      let columnArry = [];
      for (let i = 0; i < length; i++) {
        columnArry.push(this.$store.state.checkList[i].name)
      }
      return columnArry;
    }
  },
  methods: {
    onConfirm(value) {
      this.value = value;
      let index = this.checkList.indexOf(value);
      this.valueId = this.$store.state.checkList[index].id;
      this.showPicker = false;
    },
    submitError () {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "提交中"
      });

      let data = [{
        plateNumber: this.$store.state.plateNumber,
        levelOneId: this.valueId,
        nfcStatus: false,
        remark: this.remarks,
        operator: this.$store.state.userInfo.id,
        location: this.data.location,//to do 地理位置
        locationName: this.data.locationName,//to do 地理位置
        organizationId: this.$store.state.userInfo.organizationId,
        inspectStatus: "10"
      }]

      api.submitTagError(data).then(res => {
        this.$toast.clear();
        if (res.data.code === 200 ) {
          Toast.success('提交成功');
          this.backIndex();
        } else {
          this.$toast.clear();
          this.$notify({
            message: res.data.message,
            duration: 1500
          })
        }
        }).catch(err => {
          this.$toast.clear();
          this.$notify({
            message: '提交失败，请稍后重试',
            duration: 1500
          });
          console.log(err);
        });
    },
    backIndex () {
      this.$router.push("/index");
    }
  }
};
</script>

<style lang="scss" scoped>
.tagError-section {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 5rem);
  .tagError-title {
    align-items: center;
    color: #ff2121;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;

    .flex {
      padding: .5rem;
      background-image: url('../assets/icon/icon_diamond.png');
      background-size: 100% 100%;
      border-radius: .5rem;
      margin-right: .5rem;
    }

    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .error-content {
    .inner {
      padding-top: 0.5rem;
    }

    &:nth-child(3) {
      .inner {
        padding-top: 1rem;
      }
    }

    .header {
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .title {
        font-size: 1.2rem;
        font-weight: bold;
      }
      .func-btn {
        width: auto;
        padding: 0.75rem 1rem;
      }
    }

    .content {
      line-height: 1.2;
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

      .location-textarea {
        position: relative;
        font-size: 1.2rem;
        padding: 1rem;
        background-color: #CBCED3;
        border-radius: 1rem;
        color: #393C43;
        margin-bottom: 1rem;

        /deep/ textarea::-webkit-input-placeholder {
          color: #a7a7a8;
        }
      }
    }
  }
  .back-btn {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
  }
}
</style>

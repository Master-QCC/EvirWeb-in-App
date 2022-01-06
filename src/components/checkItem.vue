<template>
  <div class="check-item-section">
    <div class="flex check-header">
      <img class="icon" src="../assets/image/check-icon.svg" />
      <p class="title">{{ title }}</p>
    </div>

    <div class="flex check-standard-box">
      <img class="icon" src="../assets/image/check-standard.svg" />
      <p class="description sub">检查标准：</p>
    </div>
    <p class="check-standard">{{ checkStandard }}</p>

    <div class="flex btn-section">
      <div class="radio-section">
        <van-radio-group class="flex" v-model="statusRadio">
          <van-radio class="radio-success" name="7">正常</van-radio>
          <van-radio class="radio-fail" name="no">异常</van-radio>
        </van-radio-group>
      </div>
      <div
        class="add-nromal-img"
        v-if="isImage === 'true' && statusRadio === '7'"
      >
        <input
          type="file"
          id="file_normal_input"
          class="open-camera"
          name="img"
          accept="image/*"
          capture="camera"
          @change="selectImg($event, imgNormalList)"
        />
        <img class="icon" src="../assets/icon/check/photo.svg" />
      </div>
    </div>

    <!-- 正常-> 上传图片 -->
    <div class="flex select-image" v-if="imgNormalList.length > 0">
      <div
        class="image-item"
        v-for="(item, index) in imgNormalList"
        :key="index"
      >
        <img class="image" :src="item" />
        <img
          class="close-btn"
          src="../assets/icon/check/close.svg"
          @click="deleteImg(imgNormalList, index)"
        />
      </div>
    </div>

    <!-- 异常-> 上传图片 -->
    <transition name="fade">
      <div class="flex upload-section" v-if="statusRadio === 'no'">
        <van-radio-group class="flex effect-section" v-model="errorRadio">
          <van-radio class="radio-label gross" name="9">严重</van-radio>
          <van-radio class="radio-label slight" name="8">轻微</van-radio>
        </van-radio-group>

        <div class="sub-section">
          <van-field
            class="textarea"
            v-model="remarks"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入异常描述"
          >
          </van-field>

          <div class="flex input-section">
            <div class="flex add-error-img">
              <input
                type="file"
                id="file_error_input"
                class="open-camera"
                name="img"
                accept="image/*"
                capture="camera"
                @change="selectImg($event, imgErrorList)"
              />
              <img class="icon" src="../assets/icon/check/photo.svg" />
              <p>拍摄照片</p>
            </div>
            <div class="flex select-image" v-if="imgErrorList.length > 0">
              <div
                class="image-item"
                v-for="(item, index) in imgErrorList"
                :key="index"
              >
                <img class="image" :src="item" />
                <img
                  class="close-btn"
                  src="../assets/icon/check/close.svg"
                  @click="deleteImg(imgErrorList, index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "checkItem",
  props: {
    title: String,
    checkStandard: String,
    checkId: Number,
    isImage: Boolean
  },
  data() {
    return {
      value: "",
      statusRadio: "",
      errorRadio: "",
      openError: false,
      imgNormalList: [],
      imgErrorList: [],
      remarks: ""
    };
  },
  methods: {
    triggerNormal() {
      this.statusRadio = "7";
    },
    checkEmpty() {
      this.$toast({
        message: this.title + "未检查"
      });
      return false;
    },
    checkNormal() {
      if (this.imgNormalList.length > 0) {
        return true;
      } else {
        this.$toast({
          message: this.title + "未拍摄照片"
        });
        return false;
      }
    },
    checkEmptyError() {
      this.$toast({
        message: "请选择" + this.title + "的异常状态"
      });
      return false;
    },
    checkError() {
      if (this.imgErrorList.length > 0) {
        if (this.remarks !== "") {
          return true;
        } else {
          this.$toast({
            message: "请输入" + this.title + "的异常描述"
          });
          return false;
        }
      } else {
        this.$toast({
          message: this.title + "未拍摄异常照片"
        });
        return false;
      }
    },
    checkValidation() {
      switch (this.statusRadio) {
        case "":
          this.checkEmpty();
          break;
        case "7":
          if (this.isImage === "true") {
            this.checkNormal();
          }
          break;
        case "no":
          if (this.errorRadio === "") {
            this.checkEmptyError();
          } else {
            this.checkError();
          }
          break;
        default:
          return false;
      }
    },
    selectImg(e, targetList) {
      console.log(e);
      let files = e.target.files;
      let url = URL.createObjectURL(files[0]);
      targetList.push(url);
    },
    deleteImg(targetList, index) {
      this.$dialog
        .alert({
          title: "提示",
          message: "确定删除此照片？",
          showCancelButton: true,
          confirmButtonColor: "#3771ff"
        })
        .then(() => {
          targetList.splice(index, 1);
          this.$toast({
            message: "删除成功"
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.check-item-section {
  .check-header {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    align-items: center;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
    }

    .title {
      font-weight: 700;
    }
  }

  .check-standard-box {
    margin-bottom: 1rem;

    .icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
    }
  }

  .check-standard {
    line-height: 1.2;
  }

  .btn-section {
    margin-top: 1rem;

    .radio-section {
      .radio-success {
        margin-right: 1rem;
        &[aria-checked="true"] {
          font-weight: bold;
          border-color: #00b02f;
          background: linear-gradient(90deg, #47d16c 0%, #00b02f 100%);

          /deep/ .van-radio__label {
            color: #fff;
          }
        }
      }

      .radio-fail {
        margin-right: 1rem;
        &[aria-checked="true"] {
          font-weight: bold;
          border-color: #c60000;
          background: linear-gradient(90deg, #ff2121 0%, #c60000 100%);

          /deep/ .van-radio__label {
            color: #fff;
          }
        }
      }

      /deep/ .van-radio__label {
        margin-left: 0;
      }

      .radio-success,
      .radio-fail {
        padding: 0.5rem 1.5rem;
        border: 1px solid #393c43;
        border-radius: 2rem;
        /deep/ .van-radio__icon {
          display: none;
        }
      }
    }
  }

  .add-nromal-img {
    position: relative;
    padding: 0.5rem 1.2rem;
    border-radius: 1rem;
    background: linear-gradient(135deg, #3771ff 0%, #003de3 100%);
    box-shadow: 0px 10px 10px -5px rgba(0, 61, 227, 0.8);

    .open-camera {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    .icon {
      width: 1rem;
      height: 1rem;
      vertical-align: middle;
    }
  }

  .select-image {
    flex-wrap: wrap;
    padding-top: 1rem;
    margin-bottom: -1rem;
    .image-item {
      position: relative;
      margin-right: 1rem;
      margin-bottom: 1rem;

      .image {
        width: 4rem;
        height: 4rem;
        border-radius: 10px;
        box-shadow: 0px 8px 10px 2px #ccc;
      }

      .close-btn {
        position: absolute;
        top: -1rem;
        right: -1rem;
        width: 2rem;
        height: 2rem;
      }
    }
  }

  .upload-section {
    margin-top: 1rem;
    justify-content: space-between;
    flex-wrap: wrap;

    .effect-section {
      padding: 1rem 0;
      justify-content: space-between;
      width: 100%;
      border-top: 1px solid #acafb4;

      /deep/ .van-radio__icon--checked {
        .van-icon {
          border-color: #3771ff;
        }
      }
    }

    .sub-section {
      width: 100%;

      .textarea {
        box-sizing: border-box;
        font-size: 1.2rem;
        padding: 1rem;
        background-color: #cbced3;
        border-radius: 0.75rem;
        color: #393c43;
        margin-bottom: 1rem;

        /deep/ textarea::-webkit-input-placeholder {
          color: #a7a7a8;
        }
      }

      .add-error-img {
        position: relative;
        flex: none;
        flex-direction: column;
        align-items: center;
        color: #fff;
        padding: 0.75rem;
        margin-right: 1rem;
        border-radius: 0.75rem;
        font-size: 0.75rem;
        background: linear-gradient(135deg, #3771ff 0%, #003de3 100%);
        box-shadow: 0px 10px 10px -5px rgba(0, 61, 227, 0.8);
        width: fit-content;
        height: fit-content;

        .open-camera {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }

        .icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-bottom: 0.5rem;
          vertical-align: middle;
        }
      }
    }

    .input-section {
      .select-image {
        padding-top: 0;
      }
    }
  }

  radio .wx-radio-input {
    background-color: #2b2b2e;
    border-color: #2b2b2e;
  }
  radio .wx-radio-input.wx-radio-input-checked::before {
    color: #38383c;
  }
}
</style>

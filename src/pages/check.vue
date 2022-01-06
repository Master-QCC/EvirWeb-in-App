<template>
  <div class="check-section">
    <div class="flex check-title">
      <div class="flex text-content">
        <p class="sub">您正在检查</p>
        <p class="title">
          {{ this.$route.query.title }}<img class="title-cricle" src="../assets/image/title-cricle.png" />
        </p>
        <p class="total-number">共{{checkItemList.length}}项</p>
      </div>
      <img class="truck-img" src="../assets/image/truck.png" alt="truck" />
    </div>

    <div class="check-list">
      <div class="item" v-for="(item, index) in checkItemList" :key="index">
        <div class="inner">
          <checkItem
            ref="checkItem"
            :title="item.name"
            :checkStandard="item.checkStandard"
            :checkId="item.id"
            :isImage="item.isImage"
          ></checkItem>
        </div>
      </div>
    </div>

    <div class="flex footer">
      <div class="flex all-checked">
        <van-checkbox v-model="checked">全部正常</van-checkbox>
      </div>
      <button class="button submit-btn" :disabled="disabled" @click="submit()">提交</button>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api.js";
import checkItem from "@/components/checkItem";
export default {
  name: "Check",
  components: {
    checkItem
  },
  data() {
    return {
      checkItemList: [],
      checked: false,
      disabled: false
    };
  },
  watch: {
    checked(nweVal, oldVal) {
      if (nweVal) {
        this.$refs.checkItem.forEach(function(item, index) {
          item.triggerNormal();
        })
      }
    }
  },
  methods: {
    submit() {
      this.$refs.checkItem.forEach(function(item,index) {
        item.checkValidation()
      })
      console.log('submit')
    }
  },
  mounted() {
    let data = {
      levelOneId: this.$route.query.titleId,
      plateNumber: this.$store.state.plate
    };

    this.$toast.loading({
      duration: 0,
      forbidClick: true,
      message: "请求中"
    });

    api
      .getCheckItem(data)
      .then(res => {
        this.checkItemList = res.data;
        this.$toast.clear();
      })
      .catch(err => {
        this.$toast.clear();
        this.$notify({
          message: "获取检查列表失败，请退出重试",
          duration: 1500
        });
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.check-section {
  .check-title {
    position: relative;
    justify-content: flex-end;
    padding-top: 2rem;
    margin-bottom: 1.5rem;

    .text-content {
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      padding: 1rem 1.5rem 1rem;
      border-radius: 1rem;
      background-color: rgba(255, 255, 255, 0.5);
      backdrop-filter: saturate(180%) blur(10px);
      box-shadow: 0px 6px 6px -4px #ccc;
      min-width: 45%;

      .sub {
        font-size: 1rem;
        padding-bottom: 1.5rem;
        align-self: flex-start;
      }

      .title {
        position: relative;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1.5rem;
        text-shadow: 5px 5px 5px #acafb4;
        width: fit-content;

        .title-cricle {
          position: absolute;
          top: -0.8rem;
          right: -0.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      .total-number {
        align-self: flex-end;
      }
    }

    .truck-img {
      width: 70%;
    }
  }

  .check-list {
    padding-bottom: 6rem;
  }

  .footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: saturate(180%) blur(10px);
    box-shadow: 0px 10px 20px 8px #ccc;

    .all-checked {
      checkbox .wx-checkbox-input {
        background: #2b2b2e;
        border-color: #2b2b2e;
        border-radius: 50%;
      }

      checkbox .wx-checkbox-input.wx-checkbox-input-checked {
        background: #ffa400;
      }
    }

    .submit-btn {
      width: 100px;
      background-color: #ffa400;
      border-radius: 3rem;

      &.button-hover {
        background-color: #ce8600;
      }
    }
  }
}
</style>

<template>
  <div class="details-section">
    <div class="flex title">
      <div class="flex">
        <img class="icon" src="../assets/icon/detail/detail.svg" alt="" />
      </div>
      {{ title }}
    </div>

    <ul class="list-section">
      <li
        class="item detail-item"
        v-for="(item, index) in detailList"
        :key="index"
      >
        <div class="flex inner">
          <div class="flex content">
            <img v-if="item.inspectStatus === 7" class="icon" src="../assets/icon/detail/done.png" alt="icon" />
            <img v-else-if="item.inspectStatus === 8" class="icon" src="../assets/icon/detail/warning.png" alt="icon" />
            <img v-else-if="item.inspectStatus === 9" class="icon" src="../assets/icon/detail/error.png" alt="icon" />
            <div class="text-content">
              <p class="item-title">{{ item.levelTwoName }}</p>
              <p class="item-time">{{ item.inspectDate }}</p>
              <p class="item-status" v-if="item.inspectStatus === 7">
                状态：正常
              </p>
              <p class="item-status" v-else-if="item.inspectStatus === 8">
                状态：轻微
              </p>
              <p class="item-status" v-else-if="item.inspectStatus === 9">
                状态：严重
              </p>
            </div>
          </div>
          <button
            class="button detail-btn"
            v-if="item.imageUrl.length > 0"
            @click="openImageList(item.imageUrl, item.remark)"
          >
            查看
          </button>
        </div>
      </li>
    </ul>
    <transition name="fade">
      <gallery :imageList="imageList" :remark="remark" v-if="openGallery"></gallery>
    </transition>
  </div>
</template>

<script>
import gallery from "@/components/gallery";
export default {
  name: "Details",
  components: {
    gallery
  },
  data() {
    return {
      title: "",
      openGallery: false,
      detailList: [],
      imageList: [],
      remark: ''
    };
  },
  computed: {
    checkList() {
      let length = this.$store.state.checkList.length;
      let columnArry = [];
      for (let i = 0; i < length; i++) {
        columnArry.push(this.$store.state.checkList[i].name);
      }
      return columnArry;
    }
  },
  methods: {
    openImageList(imageUrl, remark) {
      this.imageList = imageUrl.split(',');
      this.remark = remark;
      this.openGallery = true;
    },
    closeGallery () {
      this.openGallery = false;
    },
  },
  mounted() {
    const query = this.$route.query;
    this.title = query.levelOneName;
    this.detailList = query.detailList;
  }
};
</script>

<style lang="scss" scoped>
.details-section {
  .title {
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;
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

  .list-section {
    width: 100%;

    .detail-item {
      border-bottom: 1px solid #ccc;

      .inner {
        align-items: center;
        justify-content: space-between;

        .content {
          line-height: 1.3;
          .icon {
            width: 2em;
            height: 2rem;
            margin-right: 1rem;
          }

          .item-title {
            font-weight: bold;
            font-size: 1.2rem;
          }
          .item-time {
            opacity: .5;
          }
        }

        .detail-btn {
          width: fit-content;
          padding: 0.5rem 0.75rem;
        }
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to {
    transform: translateY(-2rem);
    opacity: 0;
  }
}
</style>

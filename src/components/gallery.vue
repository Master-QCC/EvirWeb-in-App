<template>
  <div class="flex gallery-section gallery-bg" @click="closeGallery()">
    <div class="gallery-box" @click.stop>
      <van-swipe class="gallery-list-box" :show-indicators="this.imageList.length > 1" indicator-color="#003DE3">
        <van-swipe-item class="flex gallery-item" v-for="(image, index) in imageList" :key="index">
          <img class="gallery-image" v-lazy="image"/>
        </van-swipe-item>
      </van-swipe>
      <div class="sub">详情描述:</div>
      <div class="remark">{{remark}}</div>
      <button class="button close-btn" @click="closeGallery()" type="primary">确定</button>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    imageList: {type: Array, default: []},
    remark: {type: String, default: ''},
  },
  data() {
    return {

    };
  },
  methods: {
    closeGallery () {
      this.$parent.closeGallery();
    },
  }
};
</script>

<style lang="scss" scoped>
.gallery-section {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  z-index: 11;

  &.flex {
    display: flex;
    align-items: center;
  }

  &.close {
    display: none;
  }

  .gallery-box {
    width: 100%;
    border-radius: 1rem;
    background-color: #fff;
    padding: 1rem;
    overflow: hidden;

    .gallery-list-box {
      border-radius: 1rem;
      margin-bottom: 1rem;
      transition: all .5s;

      .gallery-item {
        justify-content: center;
        align-items: center;
        max-height: 400px;
        overflow: hidden;
        .gallery-image {
          max-width: 100%;
        }
      }
    }

    .sub {
      font-weight: bold;
    }

    .remark {
      padding-left: 1rem;
      margin-top: 1rem;
    }

  }
  .close-btn {
    margin-top: 1rem;
  }
}
</style>

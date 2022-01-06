<template>
  <div class="flex plate-header-section">
    <h2 class="plateNumber-title">
      {{ plate }}<i>{{ number }}</i>
      <span class="tag" v-show="plate">在线</span>
    </h2>
    <img class="logo" src="../assets/image/conti-logo.png" alt="logo">
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    plate() {
      return this.$store.state.plate.substring(0, 1);
    },
    number() {
      return this.$store.state.plate.substring(1);
    }
  }
};
</script>

<style lang="scss" scoped>
.plate-header-section {
  justify-content: space-between;

  .plateNumber-title {
    .tag {
      color: #fff;
      font-size: 0.5rem;
      background-color: #7dd0a3;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      vertical-align: middle;
    }
  }

  .logo {
    width: 7rem;
    height: 1.3rem;
  }
}
</style>

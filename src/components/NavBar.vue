<template>
  <div
    style="
      background: rgb(46, 52, 225);
      color: white;
      padding: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    "
  >
    <span style="font-size: 25px">Magazzino</span>
    <div>
      <button @click="$router.push('/')" v-if="$router.currentRoute.value.path != '/'">
        Home
      </button>
    </div>
  </div>
</template>
<script>

export default {
  name: "NavBar",
  components: {},
  mounted() {
  },
};
</script>
<style scoped>
  .h:hover{
    color: white;
  }
</style>

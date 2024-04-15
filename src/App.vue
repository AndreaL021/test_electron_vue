<template>
  <NavBar />
  <router-view />
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "AppView",
  components: {
    NavBar,
  },
  mounted() {},
};
</script>

<style>
a {
  text-decoration: none;
  color: black;
}
button{
  background: white;
  min-width: 50px;
  border-radius: 20px;
  color: green;
}
button:hover{
  transition: 0.2s;
  background: green;
  color: white;
}
.button-delete {
  font-weight: bold;
  color: red;
  background: white;
  min-width: 50px;
  border-radius: 20px;
}
.button-delete:hover {
  transition: 0.2s;
  background: red;
  color: white;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.flex {
  padding: 5px 5px 5px 5px;
  display: flex;
}
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  touch-action: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card { 
  overflow: hidden;
  border: solid 0px;
  border-radius: 10px;
  background-color: white;
}
.body-no-scroll {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.card-text {
  padding: 10px;
}
</style>

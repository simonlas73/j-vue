<template>
  <div id="app">
    <AppHeader v-once />
    <StoreList />
    <notifications classes="notification"/>
  </div>
</template>

<script>
import StoreList from "./components/StoreList";
import AppHeader from "./components/AppHeader";

export default {
  name: "App",
  components: {
    StoreList,
    AppHeader
  },
  methods: {
    checkFavourites () {
      if (localStorage && JSON.parse(localStorage.getItem('J_Favourites'))) {
        this.$store.commit('loadToFavourites');
      }
    }
  },
  mounted() {
    this.checkFavourites();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
button {
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  min-height: 44px;
  padding: 4px 32px;
  background-color: #eeb717;
  border: 1px solid transparent;
  border-radius: 32px;
  transition-duration: .2s;
  transition-property: background-color,border,color;
  transition-timing-function: ease-in-out;
}
button:hover {
  background-color: #fff;
  border-color: #eeb717;
}
.filter-bar {
  border-radius: 40px;
  border: 1px solid #9e9e9e;
  height: 40px;
  max-width: 725px;
  padding-left: 16px;
  font-size: 16px;
}
.notification {
  position: absolute;
  right: 0;
  top: 0;
  background-color: #e2e2e2;
  border-radius: 8px;
  box-shadow: 0 5px 10px 0 rgb(0 0 0 / 15%), 0 0 1px 0 rgb(0 0 0 / 8%);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: auto;
  margin: 16px 15px;
  padding: 16px;
  width: 300px;
  z-index: 140;
  border-left: 5px solid #eeb717;
}
</style>

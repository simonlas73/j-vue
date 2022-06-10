import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import StoreService from './services/StoreService';
import Notifications from '@kyvg/vue3-notification';

const app = createApp(App);

const store = createStore({
  state() {
    return {
      jStores: [],
      lastSearch: '',
      favouriteStores: []
    }
  },
  mutations: {
    // Sets favourite state of a certain store
    setFavourite(state, id) {
      const selectedStore = state.jStores.find(e => e.uuid === id);
      if (selectedStore.favourite) {
        state.favouriteStores = state.favouriteStores.filter(e => e !== selectedStore.uuid);
      } else {
        if (!state.favouriteStores.includes(selectedStore.uuid)) {
          state.favouriteStores.push(selectedStore.uuid);
        }
      }
      selectedStore.favourite = !selectedStore.favourite;
      StoreService.saveFavouriteStores(this.state.favouriteStores);
    },
    // Sets last search string state
    saveSearch(state, text) {
      state.lastSearch = text;
      StoreService.saveLastSearch(text);
    },
    // Sets favouriteStores array to the stored array
    loadToFavourites(state) {
      state.favouriteStores = JSON.parse(localStorage.J_Favourites);
    },
    // Updates state of list
    updateStoresList(state, actualList) {
      state.jStores = [...actualList];
    }
  },
  actions: {
    // Saves last search
    saveLastSearch(context, lastSearch) {
      this.state.lastSearch = lastSearch;
      context.commit('saveSearch', lastSearch);
    },
    // Sets store list
    setStoresList(context, actualList) {
      context.commit('updateStoresList', actualList);
    },
    // Sets a certain store as favourite
    setFavourite(context, id) {
      context.commit('setFavourite', id);
    }
  },
  getters: {
    // Gets stores by city
    getStoresByCity: (state) => (city) => {
      return state.jStores.filter(e => e.city === city);
    },
    // Gets favourite stores
    getFavouriteStores(state) {
      const favouriteStores = state.favouriteStores;
      return state.jStores.filter(e => favouriteStores.includes(e.uuid));
    },
    // Gets all stores
    getAllStores(state) {
      return state.jStores;
    },
    // Gets all cities by extracting them from original store data
    getAllCities(state) {
      return state.jStores.map(e => e.city).filter((item, pos, self)=>{ return self.indexOf(item) == pos});
    },
    // Gets string value of last search
    getLastSearch(state) {
      return state.lastSearch;
    }
  }
});

app.use(store);
app.use(Notifications);
app.mount('#app');

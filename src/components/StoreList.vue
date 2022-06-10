<!-- Renders all types of lists -->
<template>
  <div>
    <StoreFilter v-if="!isLoading" :lastSearch="lastSearch" @show-list-of="showListOf" @filter-value="filterStores" @run-last-search="runLastSearch"/>
    <p v-if="isLoading">Loading data...</p>
    <p v-else-if="!isLoading && stores && stores.length === 0">No data found.</p>
    <p v-else-if="!isLoading && error">{{ error }}</p>
    <section v-else>
      <ul v-if="show === 'stores'">
        <h2 v-if="lastSearchRun">Your last search: {{ filterValue }}</h2>
        <p class="hint"><strong>Tip:</strong> Click on a ☆ to save store as your favourite</p>
        <StoreListItem v-for="store in filteredList" :key="store.uuid" :store="store" :favouritesList="favouritesList" />
      </ul>
      <ul v-if="show === 'storesByCity'">
        <h2>{{ selectedCity }}</h2>
        <p class="hint"><strong>Tip:</strong> Click on a ☆ to save store as your favourite</p>
        <StoreListItem v-for="store in stores" :key="store.uuid" :store="store"/>
      </ul>
      <ul v-if="show === 'favourites'">
        <h2>Your Favourites</h2>
        <StoreListItem v-for="store in favouritesList" :key="store.uuid" :store="store" :favouritesList="favouritesList"/>
      </ul>
      <ul v-if="show === 'cities'">
        <h2>Select a city</h2>
        <p class="hint">to view stores</p>
        <StoreListItem v-for="(city, i) in cities" :key="city + i" :city="city" @select-city="filterByCity"/>
      </ul>
    </section>
  </div>
</template>

<script>
import StoreService from '../services/StoreService';
import StoreListItem from '../components/StoreListItem';
import StoreFilter from './StoreFilter.vue';

export default {
  components: {
    StoreListItem,
    StoreFilter
},
  data() {
      return {
        show: "",
        cities: this.cities,
        stores: this.stores,
        isLoading: false,
        error: null,
        filterValue: '',
        lastSearch: null,
        selectedCity: null,
        lastSearchRun: false
      };
  },
  mounted() {
    this.isLoading = true;
    this.error = null;
    this.checkLastSearch();
    this.getAllStores();
  },
  computed: {
    // Provides array of elements in list when filtering was used
    filteredList() {
      if (this.filterValue === '') return this.stores;
      const fv = this.filterValue.toLowerCase();
      return this.stores.filter(e => e.addressName.toLowerCase().includes(fv) || e.city.toLowerCase().includes(fv));
    },
    // Provides array of elements in favourites' list
    favouritesList() {
      return this.$store.getters.getFavouriteStores;
    }
  },
  methods: {
    // Gets all stores' data from API via service
    getAllStores() {
      StoreService.getAllStores().then(response => {
        this.isLoading = false;
        if (response && response.status === 200) {
          this.stores = response.data.map(({uuid, addressName, city, favourite}) => {
            addressName = addressName.replace('Jumbo', '');
            return { uuid, addressName, city, favourite }
          });
          this.$store.dispatch('setStoresList', this.stores);
          this.setFavouritesFromLocalStorage();
        } else {
          throw new Error('Failed to load data.')
        }
      }).catch((error) => {
        this.error = error.message;
      })
    },
    // Receives filter string from StoreFilter child component
    filterStores(text) {
      this.lastSearchRun = false;
      this.filterValue = text;
    },
    // Checks if last search has been stored
    checkLastSearch() {
      if (localStorage) {
        this.lastSearch = localStorage.getItem('J_Last_Search');
      }
    },
    // Receives last search string from StoreFilter child component
    runLastSearch(lastSearch) {
      this.filterValue = lastSearch;
      this.lastSearchRun = true;
    },
    // Receives selected city name from StoreFilter child component
    filterByCity(city) {
      this.show = "storesByCity";
      this.stores = this.$store.getters.getStoresByCity(city);
      this.selectedCity = city;
    },
    // Controls what type of list needs to be rendered
    showListOf(type) {
      if (type === 'cities') {
        this.cities = this.$store.getters.getAllCities;
      }
      this.checkLastSearch();
      this.filterValue = '';
      this.lastSearchRun = false;
      this.stores = this.$store.getters.getAllStores;
      this.show = type;
    },
    // Sets favourite state on saved favourite stores on first load from API
    setFavouritesFromLocalStorage() {
      const favourites = this.$store.getters.getFavouriteStores;
      favourites.forEach(el => {
        this.$store.commit('setFavourite', el.uuid);
      });
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding-inline-start: unset;
}
.hint {
  margin-top: -20px;
  margin-bottom: 30px;
}
</style>

<!-- List control buttons and filter field -->
<template>
  <div>
    <button id="show-stores-btn" @click="showListOf('stores')">Show all stores</button>
    <button id="show-cities-btn" @click="showListOf('cities')">Show cities</button>
    <button id="show-favourites-btn" v-if="favouritesExist" @click="showListOf('favourites')">Show favourites</button>
  </div>
  <div v-if="selectedType === 'stores'">
    <input type="text" class="filter-bar" role="search" placeholder="Filter by address or city" @input="enteredFilter" :value="filterValue ? filterValue : ''">
  </div>
  <div>
    <button id="save-search-btn" v-if="filterValue.length > 4 && filterValue !== lastSearch" @click="saveSearch">Save this search</button>
    <button id="last-search-btn" v-if="lastSearch && selectedType === 'stores'" @click="runLastSearch">Run last search again</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        filterValue: '',
        selectedType: ''
      }
    },
    props: ['lastSearch'],
    emits: ['show-list-of', 'filter-value', 'run-last-search'],
    methods: {
      // Emits to parent what type of list to be rendered (eg. cities)
      showListOf(type) {
        this.selectedType = type;
        this.$emit('show-list-of', type);
      },
      // Emits to parent text input entered by user in filter field
      enteredFilter(event) {
        this.filterValue = event.target.value;
        this.$emit('filter-value', this.filterValue);
      },
      // Save search text entered by user
      saveSearch() {
        this.$store.dispatch('saveLastSearch', this.filterValue).then(() => {
          this.$notify("Search saved!");
        });
      },
      // Emits to parent if last search needs to be rendered
      runLastSearch() {
        this.filterValue = this.lastSearch;
        this.$emit('run-last-search', this.filterValue);
      }
    },
    computed: {
      // Check if there are favourites stored
      favouritesExist() {
        const favourites = this.$store.getters.getFavouriteStores;
        if (favourites.length) { return true }
        return false;
      }
    }
  }
</script>

<style scoped>
div {
  padding: 10px;
}
button {
  margin: 5px;
}
</style>
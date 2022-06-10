<!-- Individual list items -->
<template>
  <li v-if="store" data-test="store">
    {{ store.addressName }}
    <span v-if="isFavourite || store.favourite" @click="setFavourite('remove')" class="favourite">★</span>
    <span v-else @click="setFavourite('add')" class="favourite">☆</span>
  </li>
  <li v-if="city" class="city" @click="selectCity">{{ city }}</li>
</template>

<script>
export default {
  props: ['store', 'city', 'favouritesList'],
  emits: ['select-city'],
  methods: {
    // Sets favourite state on item
    setFavourite(action) {
      this.$store.dispatch('setFavourite', this.store.uuid).then(() => {
        const storeName = `<strong>${this.store.addressName}</strong><br>`;
        action === 'add' ? this.$notify(storeName + "added to favourites") : this.$notify(storeName + "removed from favourites");
      });
    },
    // Emits to parent selected city
    selectCity() {
      this.$emit('select-city', this.city);
    }
  },
  computed: {
    // Checks if item is favourite
    isFavourite() {
      if (this.favouritesList && this.favouritesList.includes(this.store)) return true;
      return false;
    }
  }
}
</script>

<style scoped>
li {
  display: inline-block;
  background-color: #e3e3e3;
  margin: 5px;
  padding: 8px 15px;
  border-radius: 32px;
  transition-duration: .2s;
  transition-property: background-color,border,color;
  transition-timing-function: ease-in-out;
}
.favourite, 
.city {
  cursor: pointer;
}
.city:hover {
  background-color: #000;
  color: #fff;
}
</style>
import { mount } from '@vue/test-utils';
import StoreFilter from '@/components/StoreFilter';
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      jStores: [],
      lastSearch: '',
      favouriteStores: []
    }
  },
  getters: {
    getStoresByCity: (state) => (city) => {
      return state.jStores.filter(e => e.city === city);
    },
    getFavouriteStores(state) {
      const favouriteStores = state.favouriteStores;
      return state.jStores.filter(e => favouriteStores.includes(e.uuid));
    },
    getAllStores(state) {
      return state.jStores;
    },
    getAllCities(state) {
      return state.jStores.map(e => e.city).filter((item, pos, self)=>{ return self.indexOf(item) == pos});
    },
    getLastSearch(state) {
      return state.lastSearch;
    }
  }
});

describe('StoreFilter', () => {
  let wrapper = mount(StoreFilter, {
    global: {
      plugins: [store]
    }
  });

  it('renders fix buttons for filtering', () => {
    const showStoreButton = wrapper.find('#show-stores-btn');
    const showCitiesButton = wrapper.find('#show-cities-btn');

    expect(showStoreButton.exists()).toBe(true);
    expect(showCitiesButton.exists()).toBe(true);
  });

  it('hides conditional buttons for filtering', () => {
    wrapper = mount(StoreFilter, {
      data() {
        return {
          selectedType: '',
          filterValue: ''
        }
      },
      computed: {
        favouritesExist() {
          const favourites = store.getters.getFavouriteStores;
          if (favourites.length) { return true }
          return false;
        }
      },
    })
    const lastSearchButton = wrapper.find('#last-search-btn');
    const saveSearchButton = wrapper.find('#save-search-btn');

    expect(lastSearchButton.exists()).toBe(false);
    expect(saveSearchButton.exists()).toBe(false);
  });

})

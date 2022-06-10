import { mount, flushPromises } from '@vue/test-utils';
import StoreList from '@/components/StoreList';
import StoreService from '@/services/StoreService';
import { createStore } from 'vuex';

const mockStoreList = [
  { uuid: 123, addressName: "Store 1" },
  { uuid: 456, addressName: "Store 2" },
];

const mock = jest.spyOn(StoreService, 'getAllStores').mockResolvedValue(mockStoreList);

const $store = createStore({
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

describe('StoreList', () => {
  let wrapper = mount(StoreList, {
    global: {
      plugins: [$store]
    }
  });

  // TODO: Fix - No data found
  it('renders a store', async () => {
    await wrapper.get('#show-stores-btn').trigger('click');
    expect(StoreService.getAllStores).toHaveBeenCalledTimes(1);
    await flushPromises();
    
    const stores = wrapper.findAll('[data-test="post"]');

    expect(wrapper.html()).toContain('something'); // Just to see what is rendered
    expect(stores).toHaveLength(2);
    expect(stores[0].text()).toContain('Store 1');
    expect(stores[1].text()).toContain('Store 2');
    mock.mockClear();
  });

})

import axios from 'axios';

const storesApiUrl = 'https://api.jsonstorage.net/v1/json/00000000-0000-0000-0000-000000000000/c4357a15-46e2-4542-8e93-6aa6a0c33c1e';

export default {
  // Sends request to API for getting all store data
  async getAllStores() {
    try {
      const response = await axios.get(storesApiUrl);
      return response;
    } catch(error) {
      // Handle error
      console.log(error.message);
    }
  },
  // Stores search text to be available later
  saveLastSearch(searchText) {
    if(localStorage) {
      localStorage.setItem('J_Last_Search', searchText);
    }
  },
  // Stores ids of stores that were marked as favourite by user
  saveFavouriteStores(stores) {
    if(localStorage) {
      localStorage.setItem('J_Favourites', JSON.stringify(stores));
    }
  }
};

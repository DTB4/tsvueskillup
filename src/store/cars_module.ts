import { ActionTree } from "vuex";
import { apiURL } from "@/store/variables";
import store from "@/store/index";

interface car {
  id: number;
  number: string;
  name: string;
  color: string;
  status: string;
  created: string;
}

interface carsState {
  cars: car[];
}

const state = {
  cars: [],
};

const mutations = {
  addCars(state: carsState, cars: car[]): void {
    state.cars = cars;
  },
};
const actions: ActionTree<carsState, Record<string, unknown>> = {
  async getCars({ commit }) {
    const response = await fetch(`${apiURL}/showcars`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    if (response.ok) {
      const parsedResponse = await response.json();
      commit("addCars", parsedResponse);
    } else if (response.status == 401) {
      await store.dispatch("user/refreshTokens");
    } else {
      const parsedResponse = await response.json();
      console.log(parsedResponse);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

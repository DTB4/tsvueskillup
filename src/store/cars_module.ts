import { ActionTree } from "vuex";
import { apiURL } from "@/store/variables";

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
  async getCars() {
    const response = await fetch(`${apiURL}/showcars`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const parsedResponse = await response.json();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

import {ActionTree, useStore} from "vuex";
import { apiURL } from "@/store/variables";
import store from "@/store/index";
import user_module from "@/store/user_module";

interface coordinate {
  ID: number;
  CarID: number;
  Latitude: number;
  Longitude: number;
  OrderID: number;
  Created:string;
}

interface coordinatesState {
  coordinates: coordinate[]
}

const state = {
  coordinates: []
};

const mutations = {
  setCoordinates(state:coordinatesState, coordinates:coordinate[]){
    state.coordinates= coordinates
  },
};
const actions: ActionTree<coordinatesState, Record<string, unknown>> = {
  async getOrderMovement({ commit }, orderID:number) {
    const response = await fetch(
        `${apiURL}/ordercoords?_order_id=${orderID}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "*/*",
            Authorization: "Bearer "+ user_module.state.accessToken,
          },
        }
    );
    if (response.ok){
      let parsedResponse = await response.json()
      commit('setCoordinates', parsedResponse)
    }else if(response.status==401){
      await store.dispatch("user/refreshTokens")
      await store.dispatch("coordinates/getOrderMovement")
    }else {
      let parsedResponse = await response.json()
      console.log(parsedResponse)
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

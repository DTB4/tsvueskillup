import { ActionTree } from "vuex";
import { apiURL } from "@/store/variables";

interface order {
  id: number;
  status: string;
  car_id: number;
  created: string;
}

interface orderRequest {
  user_id: number;
  status: string;
}

interface orderState {
  orders: order[];
}

const state = {
  orders: [],
};

const mutations = {
  setOrders(state: orderState, orders: order[]): void {
    state.orders = orders;
  },
};

const actions: ActionTree<orderState, Record<string, unknown>> = {
  async getOrders({ dispatch, commit }) {
    const response = await fetch(`${apiURL}/userorders`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    if (response.ok) {
      const parsedResponse = await response.json();
      commit("setOrders", parsedResponse);
    } else if (response.status == 401) {
      await dispatch("user/refreshTokens", null, {root:true});
      await dispatch("getOrders");
    } else {
      const parsedResponse = await response.json();
      commit("user/setMessage", parsedResponse, {root:true});
    }
  },
  async createOrder({ dispatch, commit }, order: orderRequest) {
    const response = await fetch(`${apiURL}/createorder`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: order.user_id,
        status: order.status,
      }),
    });
    if (response.ok) {
      commit("setMessage", "order successfully created");
    } else if (response.status == 401) {
      await dispatch("user/refreshTokens", null, {root:true});
      await dispatch("createOrder");
    } else {
      const parsedResponse = await response.json();
      commit("user/setMessage", parsedResponse, {root:true});
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

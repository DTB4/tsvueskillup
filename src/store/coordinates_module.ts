import { ActionTree } from "vuex";
import { apiURL, apiWSURL } from "@/store/variables";

interface coordinate {
  id: number;
  carID: number;
  latitude: number;
  longitude: number;
  orderID: number;
  created: string;
}
interface coordinatesPagination {
  order_id: number;
  cursor: number;
  isForward: boolean;
}

interface coordinatesState {
  coordinates: coordinate[];
  connection: WebSocket;
  limit: number;
  cursors: number[];
  cursor: number;
  currentPage: number;
  previousPage: number;
  lastPage: boolean;
}

const state = {
  coordinates: [],
  connection: null,
  limit: 50,
  cursors: [],
  cursor: 0,
  currentPage: 0,
  previousPage: 0,
  lastPage: false,
};

const mutations = {
  setCoordinates(state: coordinatesState, coordinates: coordinate[]): void {
    state.coordinates = coordinates;
  },
  addCoordinates(state: coordinatesState, coordinate: coordinate): void {
    state.coordinates.push(coordinate);
  },
  clearCoordinates(state: coordinatesState): void {
    state.coordinates = [];
  },
  openWebsocket(state: coordinatesState, connection: WebSocket): void {
    state.connection = connection;
  },
  closeWebsocket(state: coordinatesState): void {
    state.connection.send("stop");
    state.connection.close();
  },
  turnNextPage(state: coordinatesState): void {
    state.cursors.push(state.cursor);
    state.cursor = state.coordinates[state.coordinates.length - 1].id;
    state.previousPage = state.currentPage;
    state.currentPage++;
  },
  turnPreviousPage(state: coordinatesState): void {
    const previousCursor = state.cursors.pop()
    if (previousCursor!==undefined) {
      state.cursor=previousCursor
    }
    state.currentPage--;
    state.previousPage--;
    state.lastPage = false;
  },
  setLastPage(state:coordinatesState):void{
    state.lastPage=true;
  }
};
const actions: ActionTree<coordinatesState, Record<string, unknown>> = {
  async getOrderMovement({ dispatch, commit }, orderID: number) {
    const response = await fetch(`${apiURL}/ordercoords?_order_id=${orderID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    if (response.ok) {
      const parsedResponse = await response.json();
      commit("setCoordinates", parsedResponse);
    } else if (response.status == 401) {
      await dispatch("user/refreshTokens", null, {root:true});
      await dispatch("getOrderMovement");
    } else {
      const parsedResponse = await response.json();
      console.log(parsedResponse);
    }
  },
  async getCarMovement({ dispatch, commit }, carID: number) {
    const response = await fetch(`${apiURL}/carcoords?_car_id=${carID}`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    if (response.ok) {
      const parsedResponse = await response.json();
      commit("setCoordinates", parsedResponse);
    } else if (response.status == 401) {
      await dispatch("user/refreshTokens", null, {root:true});
      await dispatch("getOrderMovement");
    } else {
      const parsedResponse = await response.json();
      console.log(parsedResponse);
    }
  },
  async getWebSocket({ commit, state }, orderID: number) {
    const url = `${apiWSURL}/ws?_order_id=${orderID}&_jwt=${localStorage.getItem(
      "access_token"
    )}`;
    commit("openWebsocket", new WebSocket(url));
    commit("clearCoordinates");
    state.connection.onmessage = function (event) {
      console.log(event.data);
      commit("addCoordinates", {
        latitude: JSON.parse(event.data).lat,
        longitude: JSON.parse(event.data).lon,
        created: JSON.parse(event.data).time,
      });
      state.connection.send("ok");
    };
  },
  async getOrderMovementPage(
    { dispatch, commit, state },
    pag: coordinatesPagination
  ) {
    const response = await fetch(
      `${apiURL}/orderpagecoords?_order_id=${pag.order_id}&_cursor=${pag.cursor}&_limit=${state.limit}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "*/*",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    if (response.ok) {
      const newMoves = await response.json();
      if (newMoves.length == state.limit) {
        if (pag.isForward) {
          commit("setCoordinates", newMoves);
          commit("turnNextPage");
        } else {
          commit("setCoordinates", newMoves);
          commit("turnPreviousPage");
        }
      } else {
        commit("setCoordinates", newMoves);
        commit("turnNextPage");
        commit("setLastPage")
      }
    } else if (response.status === 401) {
      await dispatch("user/refreshTokens", null, {root:true});
      await dispatch("getOrderMovementPage", pag);
    } else {
      const parsedResponse = await response.json();
      commit("user/setMessage", parsedResponse, {root:true});
    }
  },
  closeWebsocket({ commit }) {
    commit("closeWebsocket");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

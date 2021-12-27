import { createStore } from "vuex";
import user_module from "@/store/user_module";
import cars_module from "@/store/cars_module";

export default createStore({
  state: {
    apiURL: "http://localhost:8082",
  },
  mutations: {},
  actions: {},
  modules: {
    user: user_module,
    cars: cars_module,
  },
});

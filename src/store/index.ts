import { createStore } from "vuex";
import user_module from "@/store/user_module";
import cars_module from "@/store/cars_module";
import orders_module from "@/store/orders_module";
import coordinates_module from "@/store/coordinates_module";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
   user:user_module,
    cars: cars_module,
    coordinates : coordinates_module,
    orders: orders_module,
  },
});

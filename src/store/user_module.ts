import { ActionTree } from "vuex";
import { apiURL } from "@/store/variables";

interface loginCredentials {
  phone: string;
  password: string;
}
interface userProfile {
  phone: string;
  name: string;
}

interface userRegistration {
  phone: string;
  name: string;
  password: string;
}

interface userState {
  accessToken: string;
  refreshToken: string;
  isUserLogin: boolean;
  message: string;
  userProfile: userProfile;
}

const state: userState = {
  accessToken: "",
  refreshToken: "",
  isUserLogin: false,
  message: "",
  userProfile: {
    phone: "",
    name: "",
  },
};
const mutations = {
  setUserProfile(state: userState, user_profile: userProfile): void {
    state.userProfile = user_profile;
  },
  deleteTokens(state: userState): void {
    state.accessToken = "";
    localStorage.removeItem("access_token");
    state.refreshToken = "";
    localStorage.removeItem("refresh_token");
  },
  setUserStatus(state: userState, status: boolean): void {
    state.isUserLogin = status;
  },
  addAccessToken(state: userState, accessToken: string): void {
    state.accessToken = accessToken;
    localStorage.setItem("access_token", accessToken);
  },
  addRefreshToken(state: userState, refreshToken: string): void {
    state.refreshToken = refreshToken;
    localStorage.setItem("refresh_token", refreshToken);
  },
  setMessage(state: userState, message: string): void {
    state.message = message;
  },
};
const actions: ActionTree<userState, Record<string, unknown>> = {
  getTokensFromLocalStorage({ commit }) {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (
      accessToken !== null &&
      refreshToken !== null &&
      accessToken !== "" &&
      refreshToken !== ""
    ) {
      commit("addAccessToken", accessToken);
      commit("addRefreshToken", refreshToken);
      commit("setUserStatus", true);
    }
  },
  async refreshTokens({ commit, state }) {
    const response = await fetch(`${apiURL}/refresh`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${state.refreshToken}`,
      },
    });
    const parsedResponse = await response.json();
    if (response.ok) {
      console.log("tokens refreshed");
      commit("addAccessToken", parsedResponse.access_token);
      commit("addRefreshToken", parsedResponse.refresh_token);
      commit("setMessage", "tokens successfully refresh");
    } else if (response.status === 401) {
      commit("deleteTokens");
      commit("setUserStatus", false);
      commit("setMessage", "both tokens expired");
    } else {
      commit("deleteTokens");
      commit("setUserStatus", false);
      commit("setMessage", `${parsedResponse}`);
    }
  },
  async userLogin({ commit }, loginForm: loginCredentials) {
    const response = await fetch(`${apiURL}/login`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: loginForm.phone,
        password: loginForm.password,
      }),
    });
    const parsedResponse = await response.json();
    if (response.ok) {
      commit("addAccessToken", parsedResponse.access_token);
      commit("addRefreshToken", parsedResponse.refresh_token);
      commit("setUserStatus", true);
      commit("setMessage", "user successfully login");
    } else if (response.status === 401) {
      commit("setMessage", "invalid credentials");
    } else {
      commit("setMessage", `${parsedResponse}`);
    }
  },
  async userLogout({ commit, state }) {
    const response = await fetch(`${apiURL}/logout`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${state.accessToken}`,
      },
    });
    if (response.ok) {
      commit("deleteTokens");
      commit("setUserStatus", false);
      commit("setMessage", "user successfully logout");
    } else if (response.status === 401) {
      commit("deleteTokens");
      commit("setUserStatus", false);
      commit("setMessage", "user logout due to tokens expiration");
    } else {
      const parsedResponse = await response.json();
      commit("setMessage", `${parsedResponse}`);
    }
  },
  async getUserProfile({ dispatch, commit, state }) {
    const response = await fetch(`${apiURL}/profile`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${state.accessToken}`,
      },
    });
    if (response.ok) {
      const parsedResponse = await response.json();
      commit("setUserProfile", parsedResponse);
    } else if (response.status == 401) {
      await dispatch("user/refreshTokens");
      await dispatch("user/getUserProfile");
    } else {
      const parsedResponse = await response.json();
      commit("setMessage", parsedResponse);
    }
  },
  async registerUser({ commit }, registrationForm: userRegistration) {
    const response = await fetch(`${apiURL}/registration`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registrationForm.name,
        phone: registrationForm.phone,
        password: registrationForm.password,
      }),
    });
    if (response.ok) {
      commit("setMessage", "user successfully registered");
    } else {
      const parsedResponse = await response.json();
      commit("setMessage", parsedResponse);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

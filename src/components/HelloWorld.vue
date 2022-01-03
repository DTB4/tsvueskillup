<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h2 v-if="isUserLogin" @click="getUserProfile">User</h2>
    <h2 v-if="userProfile.name !== ''">
      Hello, {{ userProfile.name }} !!!
    </h2>
    <h2 v-if="message !== ''">{{ this.message }}</h2>
    <h2 v-if="isUserLogin" @click="userLogout">Logout</h2>
    <h2 @click="userLogin({ phone: '+380508577629', password: 'qwe1qwe1' })">
      Login
    </h2>
    <h2 @click="getCarMovement(1)">Get Car coordinates</h2>
    <h2 @click="getOrderMovement(333)">Get order coordinates</h2>
    <h2 @click="getWebSocket(361)">Get websocket</h2>
    <h2 @click="closeWebsocket">Close Websocket</h2>

    <div class="pagination">
      <button
        v-if="previousPage !== 0"
        @click="getOrderMovementPage({ order_id: 354, cursor: cursors[cursors.length-2], isForward: false })"
      >
        Previous
      </button>
      <button v-if="previousPage === 0">Previous</button>
      <button>{{ currentPage }}</button>
      <button
        v-if="!lastPage"
        @click="getOrderMovementPage({ order_id: 354, cursor: cursor, isForward: true })"
      >
        Next
      </button>
      <button v-if="lastPage">Next</button>
    </div>

    <div v-for="coordinate in coordinates" :key="coordinate.id">
      {{ coordinate }}
    </div>

    <h2 @click="getOrders">Get Orders</h2>

    <div v-for="order in orders" :key="order.id">
      {{ order }}
    </div>

    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
          target="_blank"
          rel="noopener"
          >router</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
          target="_blank"
          rel="noopener"
          >vuex</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          >eslint</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
          target="_blank"
          rel="noopener"
          >typescript</a
        >
      </li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener"
          >Forum</a
        >
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank" rel="noopener"
          >Community Chat</a
        >
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener"
          >Twitter</a
        >
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapActions, mapState } from "vuex";
import OrderMove from "@/components/OrderMove.vue";

@Options({
  components: { OrderMove },
  props: {
    msg: String,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["isUserLogin", "message", "userProfile"]),
    ...mapState("coordinates", [
      "coordinates",
      "currentPage",
      "lastPage",
      "previousPage",
      "cursor",
        "cursors"
    ]),
    ...mapState("orders", ["orders"]),
  },
  methods: {
    ...mapActions("coordinates", [
      "getOrderMovement",
      "getCarMovement",
      "getWebSocket",
      "closeWebsocket",
      "getOrderMovementPage",
    ]),
    ...mapActions("user", [
      "userLogin",
      "userLogout",
      "getTokensFromLocalStorage",
      "getUserProfile",
    ]),
    ...mapActions("orders", ["getOrders"]),
  },
  created() {
    this.getTokensFromLocalStorage();
  },
})
export default class HelloWorld extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

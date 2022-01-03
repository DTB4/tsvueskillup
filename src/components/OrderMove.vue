<template>
  <div>
    {{ coordinate }}
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    coordinate: {},
  },
  data() {
    return {};
  },
})
export default class OrderMove extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

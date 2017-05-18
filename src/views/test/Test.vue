<style>

</style>

<template>
  <main>
    Here is test.html
  </main>
</template>

<script>
  export default {
    data() {
      return {
      }
    },

    created() {
      this.$api.hello().then(data => {
        console.log(data);
      });
    },

    methods: {

    }
  };
</script>
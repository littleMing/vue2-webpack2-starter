module.exports = {
  template: require('./test.html'),

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

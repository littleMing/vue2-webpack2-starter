require('./login.css');

module.exports = {
  template: require('./login.html'),

  data() {
    return {
      username: '',
      password: '',
      loginErrorMessage: null
    }
  },

  methods: {
    login() {
      this.$security.login(this.username, this.password).then(data => {
        this.loginErrorMessage = null;
        this.$route.router.go('/dashboard');
      }, __ => {
        this.loginErrorMessage = '密码不正确';
      });
    }
  }
};

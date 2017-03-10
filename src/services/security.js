module.exports = class Security {
  constructor($api) {
    if (!$api) throw new Error('$api must not null');
    this.$api = $api;
    this._user = new Vue({
      data: {
        channelCode: null,
        channelId: null,
        name: null,
      }
    });
  }

  get user () {
    return this._user._data;
  }

  getCurrentUserFromServer() {
    return this.$api.getCurrentUserFromServer().then(data => {
      _.merge(this._user._data, data);
      return this.user;
    });
  }

  isAuthed() {
    return this.user.name != null;
  }
  
  login(username, password) {
    return this.$api.login(username, password).then(__ => {
      return this.getCurrentUserFromServer();
    });
  }

  logout() {
    return this.$api.logout();
  }

  check(cb) {
    return this.getCurrentUserFromServer().then(__ => {
      if (!this.isAuthed())
        cb();
    })
  }
};

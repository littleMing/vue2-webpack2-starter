const APIPrefix = '../../api';

class API {

  constructor($http) {
    this.$http = $http;
  }

  hello() {
    return this.$http.get(`/api/hello`)
      .then(resp => {
      return resp.body;
    });
  }
};

module.exports = new API(Vue.http);
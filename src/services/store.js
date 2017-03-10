const InitialState = {

};

class Store {
  constructor() {
    var state = this.restoreState();
    // Use a Vue instance to save state because the state can be reactive
    this._state = new Vue({
      data: state
    });

    this._viewState = new Vue({
      data: {
        title: '',
        hideNavBar: false
      }
    });
  }


  get state () {
    return this._state._data;
  }

  get viewState () {
    return this._viewState._data;
  }

  clearState () {
    try {
      const exclude = [];
      Object.keys(InitialState).forEach(key => {
        if (!exclude.includes(key)) {
          this._state[key] = _.clone(InitialState[key]);
        }
      });
      this.saveState();
    } catch (e) {
      console.error(e);
    }
  }

  saveState () {
    try {
      localStorage.setItem('vue2', JSON.stringify(this.state));
    } catch (e) {
      console.error(e);
    }
  }

  restoreState () {
    var state = {};
    try {
      var item = localStorage.getItem('vue2');
      if (item) {
        state = JSON.parse(item);
      }
    } catch (e) {
      console.error('restore state: ', e);
    }

    var result = _.merge({}, InitialState, state);
    return result;
  }


}

module.exports = new Store();

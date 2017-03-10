if (__DEV__) {
  console.log('Development Mode');
} else {
  console.log('Production Mode');
}

Vue.config.debug = __DEV__ ? true : false;

window.onunhandledrejection = function (rejection) {
  console.error(rejection.promise);
  // console.error(rejection.promise._d.v.stack);
};

// Vue plugins
const Router = require('vue/vue-router');
const VueResource = require('vue/vue-resource');
Vue.use(Router);
Vue.use(VueResource);

Vue.prototype.$store = require('./services/store');
Vue.prototype.$api = require('./services/api');
Vue.prototype.$comp = {}; // App Level Components
var Security = require('./services/security');
Vue.prototype.$security = new Security(Vue.prototype.$api);

// Main App
const App = require('./app');
require('./common');
require('./components');

// routing
var router = new Router({
  routes: [
    {
      path: '/test',
      component: function (resolve) {
        require(['./views/test/test'], resolve);
      }
    }
  ],
  scrollBehaviour(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

// router.redirect({
//   '*': '/test'
// });

// Vue.http.interceptors.push((req, next) => {
//   next(resp => {
//     // console.log(resp);
//     if (resp.status == 401 || resp.status == 403)
//       router.go('/login');
//     else if (resp.status == 400 || resp.status == 500)
//       Vue.prototype.$comp.toast.error(resp.data.message);
//   });
// });

router.beforeEach((to, from , next) =>{
  // router.app.$comp.toast.closeAll();
  // router.app.$comp.spinner.hide();
  // console.log(router.app.$security.check());
  // if (!transition.to.path.includes('test'))
  //   router.app.$security.check(__ => {
  //     router.go('/login');
  //   });

  next();
});

router.afterEach(route => {
  console.log(route);
  // router.app.$store.viewState.hideNavBar = transition.to.hideNavBar;
});

const app = new Vue(_.assign(App, {router: router})).$mount('#app');
if (__DEV__) {
  console.log('Development Mode');
} else {
  console.log('Production Mode');
}

Vue.config.debug = __DEV__ ? true : false;

window.onunhandledrejection = function (rejection) {
  console.error(rejection.promise);
};

// Vue plugins
import Router from 'vue-router';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

Vue.use(Router);
Vue.use(VueResource);
Vue.use(ElementUI);

Vue.prototype.$store = require('./services/store');
Vue.prototype.$api = require('./services/api');
Vue.prototype.$comp = {}; // App Level Components
var Security = require('./services/security');
Vue.prototype.$security = new Security(Vue.prototype.$api);

// Main App
// const App = require('./app');
import App from './app/App.vue';
require('./common');
require('./components');
const Base = require('./views/product');

// routing
var router = new Router({
  routes: [
    {
      path: '',
      redirect: {name: 'test'}
    },
    {
      path: '/test',
      name: 'test',
      component: resolve => {
        require(['./views/test/Test.vue'], resolve);
      }
    },
    {
      path: '/app',
      component: { template: '<div><router-view></router-view></div>'},
      children: [
        {
          path: 'product',
          component: Base.Product
        }
      ]
    }
  ],
  scrollBehaviour(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

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
  // console.log(route);
  // router.app.$store.viewState.hideNavBar = transition.to.hideNavBar;
});

const app = new Vue(_.assign(App, {router: router})).$mount('#app');
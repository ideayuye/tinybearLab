

const Foo = { template: '<div>foo <router-view></router-view></div>' }
const Bar = { 
  template: '<div>bar {{$route.params.id}} </div>' ,
  watch:{
    '$route' (to,from){
      console.log(to,from);
    }
  }
}

const Chl = {template:'<div> children </div>'};
const Gloot = {template:'<div> Gloot {{$route.params.userId}}</div>'};
const ViewA = {template:'<div> view a </div>'};
const Redirect = {template:'<div> redirect </div>'};
const NotFoundComponent = {template:'<div>404</div>'};

const routes = [
  { path: '/foo', component: Foo ,
    redirect:()=>'/redi',
    children:[{
      path:'chl',
      component:Chl
    }]
  },
  { path: '/bar/:id', component: Bar },
  { path: '/gloot/:userId',component:Gloot,name:'gl'},
  { path: '/view',
    components:{
      default:Gloot,
      a:ViewA
    },
    alias:'/v' 
  },
  { path:'/redi',component:Redirect },
  { path: '*', component: NotFoundComponent }
];

const router = new VueRouter({
  // mode: 'history',
  routes // （缩写）相当于 routes: routes
});

const app = new Vue({
  el:'#app',
  router
});//.$mount('#app');


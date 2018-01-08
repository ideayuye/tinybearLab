
var moduleA = {
    state:{t:10},
    mutations:{
        minus:function(state){
            state.t --;
        },
        increment:function(state){
            state.t++;
        }
    },
    actions:{
        minus:function(context){
            context.commit('minus')
        },
        increment:function(context){
            context.commit('increment')
        }
    },
    getters:{
        t:function(state){
            return state.t;
        }
    }
}

//store
var store = new Vuex.Store({
    //state
    state:{count:0},
    //mutations
    mutations:{
        increment:function (state) {
            state.count++
        }
    },
    //actions
    actions:{
        increment: function (context){ 
            context.commit('increment');
        }
    },
    modules:{
        a:moduleA
    }
});

//修改分支

new Vue({
    el:"#vuex_lab",
    store,
    computed:{
        ...Vuex.mapGetters([
            't'
        ])
    },
    methods: Vuex.mapActions([
        'increment',
        'minus'
    ])
});


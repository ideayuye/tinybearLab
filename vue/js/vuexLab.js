
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
    }
});

//修改分支

new Vue({
    el:"#vuex_lab",
    store,
    methods: Vuex.mapActions([
        'increment'
    ])
});



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
        increment: ({ commit }) => commit('increment')
    }
});

new Vue({
    el:"#vuex_lab",
    store
});


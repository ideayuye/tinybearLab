
import app from './app.vue';

var wk = new Vue({
    el:'#vue_loader_lab',
    components:{
        'test':app
    }
    // render:h=>h(app)
});
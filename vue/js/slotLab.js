
/*插槽*/
var child = {
    template:'#slot_child'
}

var t = new Vue({
    el:'#slot_lab',
    data:{message:'slot'},
    components:{
        'child':child
    }
});


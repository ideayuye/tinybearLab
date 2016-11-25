

Vue.component('js-render',{
    render:function(createElement){
        return createElement(
            'h'+this.level,
            {
                attrs:{
                    'data-wo':'hi'
                },
                domProps:{
                    innerText : "fafafaf"
                }
            }
            /*[
                createElement('a',{
                    attrs:{
                        name:"t1",
                        href:'#t_id'
                    }
                },this.$slots.default)    
            ]*/
        );
    },
    props:{
        level:{
            type:Number,
            required:true
        }
    }
});

new Vue({
    el: '#render_lab',
    data: {
        level: 2
    }
});



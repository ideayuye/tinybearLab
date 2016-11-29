
var computeApp =
new Vue({
    el:'#computed_lab',
    data:{
        who:'billi',
        work:{
            job:'week'
        }
    },
    computed:{
        sayHello:function(){
            return "Hi,"+this.who+" job:" + this.work.job;
        }
    }
});

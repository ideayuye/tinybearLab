
var dynamicComp =
new Vue({
    el:"#dynamic_componet_lab",
    data:{
        currentView:"home"
    },
    components:{
        home:{
            template:"<div>home<div>"
        },
        room:{
            template:"<div>room</div>"
        }
    }
});


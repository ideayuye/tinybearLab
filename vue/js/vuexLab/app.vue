<template>
  <div id="test">
      <p>test</p>
      <div>render {{count}}</div>
  </div>
</template>

<script>
export default {
    data(){
        return { count:0 };
    },
    methods:{
        add (num){
            console.log(num);
            count += num;
        }
    }
}
</script>

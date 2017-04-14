
'use strict'
/*6.9.1 不支持动态引入*/
import('./module.js').then(modules=>{
    console.log(modules);
})

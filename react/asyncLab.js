
let delay = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(function() {
            resolve('hello');
        }, 1000);
    });
}

let st = async ()=>{
    let hello = await delay();
    console.log(hello);
    // hello.then(v=>{console.log(v)})
}

st().then(()=>{
    console.log('exec end');
});

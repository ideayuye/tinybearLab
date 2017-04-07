// var Mock = require('mockjs')
var data = Mock.mock({
    'list|10': [{
        'id|+1': 1,
        'email':'@email',
        'color':'@color'
    }]
})

console.log(data);

Mock.mock('http://localhost:9527/test',data);

/*
    检查便签是否都闭合
*/

var CheckTag = function () {
    this.regCheck = /<([a-zA-Z]\w*)(?:\s[^<>]*?)?>|<\/([a-zA-Z]\w*)>/g;
    this.regTmpl = null;
    this.regComment = null;
}

CheckTag.prototype._weedOut = function(html){
    //剔除textarea内部的文本
    //剔除注释的dom
    //剔除script里的html
    var me = this;
    me.regTmpl = me.regTmpl || /<(textarea|script)(\s[^<>]*?)?>(?:[\s\S]*?)<\/\1>/g;
    me.regComment = me.regComment || /<!--(?:[\s\S]*?)-->/g;
    return html.replace(me.regTmpl, '').replace(me.regComment, '');
}

CheckTag.prototype._fetchUnclosedTag = function (node) {
    //从dom树抓取未闭合标签
    //遍历dom tree 检查未闭合的标签
    var me = this;
    var unclosedTags = [];
    (function (node) {
        var args = arguments;
        if (!node.isEnd) {
            unclosedTags.push(node);
        }
        if (node.children.length) {
            node.children.forEach(function (n) {
                args.callee(n);
            });
        }
    })(node);
    return unclosedTags;
}

CheckTag.prototype.isSelfCloseTag = function(tag){
    //检查自闭合标签
    var tag = tag.toLowerCase();
    var selfCloseTags = {
        img: 1,
        input: 1,
        br: 1,
        link: 1,
        meta: 1,
        area: 1
    }
    return selfCloseTags[tag];
}

var TempNode = function(tag,isEnd,all){
    this.isEnd = isEnd || false;
    this.tag= tag || 'root';
    this.all= all||'';
    this.children = [];
    this.parent= null;
}

CheckTag.prototype.check = function (html) {
    var me = this;
    var domTree = new TempNode('root',true),
        cnode = domTree;
    me.regCheck = me.regCheck || /<([a-zA-Z]\w*)(?:\s[^<>]*?)?>|<\/([a-zA-Z]\w*)>/g;

    html = this._weedOut(html);

    html.replace(me.regCheck, function (all, preTag, backTag) {
        if (preTag) {
            preTag = preTag.toLowerCase();
            var node = new TempNode(preTag,false,all);
            node.parent = cnode;
            cnode.children.push(node);
            //自闭合标签没有children
            if (!me.isSelfCloseTag(preTag))
                cnode = node;
            else
                node.isEnd = 1;
        }
        if (backTag) {
            backTag = backTag.toLowerCase();
            if (backTag == cnode.tag) {
                cnode.isEnd = 1;
                cnode = cnode.parent;
            } else if (cnode.parent && backTag == cnode.parent.tag) {
                //当前标签未闭合 判断该标签和父标签匹配
                cnode.parent.isEnd = 1;
                cnode = cnode.parent.parent;
            } else {
                console.log('多余闭合标签', '</' + backTag + '>', cnode.all, cnode.parent && cnode.parent.all);
            }
        }
        return "";
    });

    return me._fetchUnclosedTag(domTree);
}

CheckTag.prototype.report = function(unclosedTags){
    unclosedTags.forEach(function(node){
        console.log("疑似未闭合标签:", node.all, "上级dom：" + node.parent.all);
    });
    console.log('检查完毕,未闭合标签数：' + unclosedTags.length);
}


var http = require('http');
var checker = new CheckTag();

var req = http.request({
    hostname: 'localhost',
    port: 9527,
    method: 'GET',
    path: '/tx.html'
}, function (res) {
    var body = "";
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        checker.report( checker.check(body));
    });
});

req.on('error', function (e) {
    console.log(`problem with request: ${e.message}`);
});

req.end();
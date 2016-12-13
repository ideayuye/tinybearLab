
var s1 = "filter:alpha(opacity=50);";

var reg = new RegExp('opacity=(\\d+)');
console.log(s1.match(reg));

var s2 = "<div class='blx'><b>hello</b><i>nii</i></div>";
var reg2 = /<(?:\/?)(?:\w+)([^>]*?)>/;
var match ;
/*while((match = reg2.exec(s2)) !== null){
    console.log(match);
}*/
console.log(s2.match(reg2));

function upper(all,letter){
    return letter.toUpperCase();
}

var s3 = "border-bottom-width";
var reg3 = /-(\w)/g;
var res3 = s3.replace(reg3,upper);
console.log(res3);



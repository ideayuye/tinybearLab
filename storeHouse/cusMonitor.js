var CusMonitor = function () {}

CusMonitor.prototype.shot = function (data) {
    $.ajax('http://indus.site/log', {
        data: data,
        dataType: 'jsonp',
        success: function (data) {
            // console.log(data);
        }
    });
};

CusMonitor.prototype.check = function(){
    var cookieCus = d('custno');
    if( customerId && cookieCus && customerId != cookieCus){
        this.shot({
            cookieCustomerId :cookieCus,
            pageCustomerId :customerId,
            navigator:window.navigator.userAgent,
            time:(new Date()).toString()
        });
    }
};

(function(){
    var customerMoni = new CusMonitor();
    customerMoni.check();
})();


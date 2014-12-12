define ([], function () {
   var ajaxGet = function (url) {
        return new Promise(function (resolve, reject) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', url, true);

            xmlHttp.onload = function () {
                if(xmlHttp.status == 200){
                    resolve(xmlHttp.responseText);
                }
                else reject(Error(xmlHttp.statusText));
            };
            xmlHttp.send();
        });
    };
    return ajaxGet;
});
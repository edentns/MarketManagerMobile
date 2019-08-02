(function () {
    "use strict";

    angular.module("login")
        .directive("loginNtcPop", function () {
        	return {
        		restrict: 'A',
                scope:{},
        	    link: function(scope, element, attr) {
    	    		var $slideBox = angular.element(attr.loginNtcPop);        	    		
    	    		var xmlHttp;
    	            var options = { year: '2-digit', month: '2-digit', day: '2-digit' , hour: 'numeric', minute : '2-digit', hour12: false },
    	    	    	date = "", srvDate = "",
    	    	    	//trDate = "1810021554";
    	    	    	trDate = "1810070800";
    	        	
    	            try {
    	                //FF, Opera, Safari, Chrome
    	                xmlHttp = new XMLHttpRequest();
    	            }
    	            catch (err1) {
    	                //IE
    	                try {
    	                    xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
    	                }
    	                catch (err2) {
    	                    try {
    	                        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    	                    }
    	                    catch (eerr3) {
    	                        //AJAX not supported, use CPU time.
    	                        alert("AJAX not supported");
    	                    }
    	                }
    	            }
    	            
    	            xmlHttp.open('HEAD', window.location.href.toString(), false);
    	            xmlHttp.setRequestHeader("Content-Type", "text/html");
    	            xmlHttp.send('');        	            
    	    	    date = xmlHttp.getResponseHeader("Date");
    	    	    date = new Date(date);
    	    	    srvDate = date.toLocaleDateString("ko-kr", options).replace(/[^0-9]/g,'');        	            
    	            
    	    	    if(srvDate > trDate){
    	    	    	$slideBox.css("display","none");
    	    	    }
        	   }
        	};  
        });
}());

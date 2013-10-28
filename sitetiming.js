var counter;
var time = [];

function add_script(scriptURL, onloadCB) {
      var scriptEl    = document.createElement("script");
      scriptEl.type   = "text/javascript";
      scriptEl.src    = scriptURL;
      function calltheCBcmn() {
        onloadCB(scriptURL);
      }
      if(typeof(scriptEl.addEventListener) != 'undefined') {
        /* The FF, Chrome, Safari, Opera way */
        scriptEl.addEventListener('load',calltheCBcmn,false);
      }
      else {
        /* The MS IE 8+ way (may work with others - I dunno)*/
        function handleIeState() {
          if(scriptEl.readyState == 'loaded'){
            calltheCBcmn(scriptURL);
          }
        }
        var ret = scriptEl.attachEvent('onreadystatechange',handleIeState);
      }
      document.getElementsByTagName("head")[0].appendChild(scriptEl);
    }
function init () {
	compute();
	if(!check())
		setInterval(function(){
			compute();
			if(check()){
				clearInterval();	
			}
			displayTab();
		},1000)
}
function after() {
	if('undefined' == typeof Highcharts){
		add_script("http://code.highcharts.com/highcharts.js",after1);
	}else{
		after2();	
	}
}
function after1 () {
	add_script("http://code.highcharts.com/modules/exporting.js",after2);
}
function after2 () {
        $('#NavagationTimingClose a').click(function(){
		$('#TimingAnalytics').remove();
	})
		Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		});
		
		// Build the chart
        $('#NavagationTimingPie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
	    title:{
		text:null
	    },
	    exporting:{
		enabled:false
	    },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
			    if(this.percentage){
                            	return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage) +' %';
			    }
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['重定向时间：',   time[0]],
                    ['DNS查找时间：',      time[1]],
                    {
                        name: '建立TCP连接时间：',
                        y: time[2],
                        sliced: true,
                        selected: true
                    },
                    ['响应时间：',    time[3]],
                    ['页面下载时间：',    time[4]],
                    ['dom加载时间：',   time[5]],
                    ['event加载时间：',   time[6]],
                ]
            }]
        });
}

function compute() {
	//重定向时间：
	time[0] = performance.timing.redirectEnd - performance.timing.redirectStart;
	//DNS查找时间：
	time[1] = performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
	//建立TCP连接时间：
	time[2] = performance.timing.connectEnd - performance.timing.connectStart;
	//响应时间：
	time[3] = performance.timing.responseStart - performance.timing.requestStart;
	//页面下载时间：
	time[4] = performance.timing.responseEnd - performance.timing.responseStart;
	//dom加载时间：
	time[5] = performance.timing.domComplete - performance.timing.domLoading;
	//event加载时间：
	time[6] = performance.timing.loadEventEnd - performance.timing.loadEventStart;
}
function check() {
	var timeLength = time.length,
	    isOver = true;
	for (var i=0; i < timeLength; i++) {
		if(time[i] < 0){
			time[i] = "waiting...";
			isOver = false;
		}
	};
	return isOver;
}
function displayTab () {
	style = "<style>" + 
		"#TimingAnalytics{opacity:0.95;border-radious:5px;z-index:10000;background:white;width:500px;height:515px;position:fixed;right:0;top:0;}" +
		"#TimingAnalyticsTab{padding:5px;width:100%;height:100px;}" +
		"#NavagationTimingPie{}" +
		"#TimingAnalyticsTab td{position:relative;overflow:hidden;border:1px solid black;padding:5px;}" +
		"#TimingAnalyticsTab caption{text-align:center;font-weight:bold;font-size:14px;line-height:30px;}" +
		"#NavagationTimingClose{color:blue;width:100%;text-align:center;}" +
		"</style>";
	contentHtml = "<div id='TimingAnalytics'><table id='TimingAnalyticsTab'>" +
			"<caption>NavagationTiming Analytics</caption>" +
			"<tr><td>重定向时间</td><td>" + time[0] + "ms</td></tr>" +
			"<tr><td>DNS查找时间</td><td>" + time[1] + "ms</td></tr>" +
			"<tr><td>建立TCP连接时间</td><td>" + time[2] + "ms</td></tr>" +
			"<tr><td>响应时间</td><td>" + time[3] + "ms</td></tr>" +
			"<tr><td>页面下载时间</td><td>" + time[4] + "ms</td></tr>" +
			"<tr><td>dom加载时间</td><td>" + time[5] + "ms</td></tr>" +
			"<tr><td>event加载时间</td><td>" + time[6] + "ms</td></tr>" +
		      "</table>";
	contentHtml += '<div id="NavagationTimingPie" style="min-width: 500px; height: 280px; margin: 0 auto;z-index:9999;"></div>'
	contentHtml += '<div id="NavagationTimingClose" ><a href="javascript:;">Click here to close</a></div>'
	document.body.innerHTML += style;
	document.body.innerHTML += contentHtml;
}

console.log(time);
console.log("----------------Page Load Time Analytics---------------");
console.log("重定向时间：" + time[0] + "ms");
console.log("DNS查找时间：" + time[1] + "ms");
console.log("建立TCP连接时间：" + time[2] + "ms");
console.log("响应时间：" + time[3] + "ms");
console.log("页面下载时间：" + time[4] + "ms");
console.log("dom加载时间：" + time[5] + "ms");
console.log("event加载时间：" + time[6] + "ms");
console.log("-------------------------------------------------------");
init();
add_script("http://localhost/js/jquery-1.7.2.min.js",after);
displayTab ();

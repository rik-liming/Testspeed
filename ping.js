var globalVar = 
{
    result: {},
    loopCount: 50,
    totalTestCount: 0,
    completeTestCount: 0,
    ipList: ['1.2.3.4', '1.2.3.4'],
    uploadUrl: "http://xxx.com"
};

// httpģ��ping��ʵ�ֺ���
$.pingLogic = function(option) 
{
    var ip = option.ip;
    var requestTime = 0;
    var responseTime = 0;
    var pingTime = 0;
    var pingResult = {};
    var url = 'http://' + ip + '/'+ (new Date()).getTime() + '.html';  //����һ���յ�ajax����
    
    $.ajax({
        url: url,
        type: 'get',
        async: false,
        timeout: 10000,
        beforeSend : function() 
        {
	// console.log('currentLoop: ' + option.currentLoop);
	// console.log('currentIndex: ' + option.currentIndex);
            requestTime = new Date().getTime();
        },
        complete : function() 
        {
            responseTime = new Date().getTime();
            pingTime = responseTime - requestTime;
	pingResult['ip'] = ip;
	pingResult['pingTime'] = pingTime;
	
	if (!globalVar['result'][ip])
	{
	    globalVar['result'][ip] = [];
	}
	globalVar['result'][ip].push(pingResult);
	
	globalVar['completeTestCount'] ++;
	
	if (globalVar['completeTestCount'] === globalVar['totalTestCount'])
	{
	    alert('Test speed finish!');
	    $("#startBtn").removeClass("disabled");
	    $("#uploadBtn").removeClass("disabled");
	    // ��ʾ��
	    $("#testingInfo").addClass("hidden");
	}
        }
    });
};

// ��������ĺ������
function startTestSpeed()
{
   // ÿ�ε��ǰ�������н��
   globalVar['result'] = {};
   globalVar['completeTestCount'] = 0;
   globalVar['totalTestCount'] = globalVar['ipList'].length * globalVar['loopCount'];
   
   // ��ʾ��
   $("#testingInfo").removeClass("hidden");
   $("#startBtn").addClass("disabled");
   
   setTimeout(function() {
       for (var index in globalVar['ipList'])
       {
           for (var i = 0; i < globalVar['loopCount']; i++)
           {
                $.pingLogic({
                   ip: globalVar['ipList'][index],
	       currentLoop: i,
	       currentIndex: index,
                });     
           }
       }	   
   }, 1000);
}

// �ϱ����Խ��
function uploadResult()
{
    $("#uploadBtn").addClass("disabled");
    
    $.post(globalVar["uploadUrl"], {data: JSON.stringify(globalVar["result"])}, function(data){
        var resultData = $.parseJSON( data );
        
        if (resultData.ret == 0) {
	alert("upload success!");
        } else {
	alert("upload fail!");
        }
    });
}
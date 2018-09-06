$(function () {
 	var range = 1;             //距下边界长度/单位px
    var maxnum = 200;            //设置加载最多次数
    var num = 1;
    var totalheight = 0;
    var main = $(".ckgdzp");                     //主体元素
    var getCompany = function(){
    	$.ajax({
        		url:'http://wams.veryeast.cn/activity/vbole/index.php?a=getcompanies',
        		type:'post',
        		data:{page:num},
        		dataType:'json',
        		success:function(data){
        			if(data.status ==1){
        				var str = '';
        				$.each(data.msg, function(company) {
        					str += '<div class="ckgdzp_content"><label>'+company.company_name
        					+'</label><ul>';
        					$.each(company.jobs,function($job){
        						str += '<li><a>'+$job.job_name+'</a></li>'
        					});
        					+'</ul></div>';
        				});
        				main.append(str);
            			num++;
        			}
        		}
        	});
    }
    getCompany();
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight  && num != maxnum) {
        	console.log(num);
        	getCompany();
        }
    });



 	//弹窗
 	layer.config({
  		extend:['skin/seaning/style.css'],
	});
	$('.hd_btn').click(function(){
		layer.open({
			type: 1,
	  		title: '活动规则',
	  		area: ['80%'],
	  		closeBtn: 1,
	  		shadeClose: true,
	  		skin: 'layer-ext-seaning',
	  		content:$('.hdgz')
		});
	});
	$('.wyzj').click(function(){
		$.ajax({
			type:"post",
			url:"http://wams.veryeast.cn/activity/vbole/index.php?a=isLogin",
			dataType:'json',
			success:function(data){
				if(data.status==1){//已登录，直接投递，发送投递请求
					$.ajax({
						url:'http://wams.veryeast.cn/activity/vbole/index.php?a=applyJob',
						type:'post',
						data:{job_id:$('#job_id').val()},
						dataType:'json',
						success:function(data){
							if(data.status==1){//成功，弹成功的框
								layer.open({
									type: 1,
							  		title: '自荐领赏金',
							  		area: ['80%'],
							  		closeBtn: 1,
							  		shadeClose: true,
							  		skin: 'layer-ext-mylayer',
							  		content:$('.zjcg')
								});
							}
						}
					});
				}else{//未登录，先登录
					layer.open({
						type: 1,
				  		title: '自荐领赏金',
				  		area: ['80%'],
				  		closeBtn: 1,
				  		shadeClose: true,
				  		skin: 'layer-ext-mylayer',
				  		content:$('.zjtc')
					});
				}
			}
		});

	});
   $('#qr').click(function(){
    	layer.closeAll();
    })
   $('#dltj').click(function(){
   	layer.open({
			type: 1,
	  		title: '自荐领赏金',
	  		area: ['80%'],
	  		closeBtn: 1,
	  		shadeClose: true,
	  		skin: 'layer-ext-mylayer',
	  		content:$('.zjlqsj')
		});
   });

   $('.wytj').click(function(){
   	layer.open({
   		type:1,
   		title:'推荐领赏金',
   		area:['80%'],
   		closeBtn:1,
   		shadeClose: true,
  		skin: 'layer-ext-mylayer',
  		content:$('.tjlsj')
   	});
   });
   $('.c').click(function(){
   	    $('.fx').show();
   });
   $('.fx').click(function(){
   	    $('.fx').hide();
   });

    $('.cktjjl').click(function(){
    	$.ajax({
    		type:"get",
    		url:"",
    		async:true
    	});
   	layer.open({
   		type:1,
   		title:'查看推荐记录',
   		area:['80%'],
   		closeBtn:1,
   		shadeClose: true,
  		skin: 'layer-ext-mylayer',
  		content:$('.cktjjlopen')
   	});
   });

 	$("#zjlqsj_signupForm").validate({
	    rules: {
		    zjlqsj_name:"required",
	       	zjlqsj_password: {
		        required: true,
		        rangelength:[6,20]
		    },
	    },
	    messages: {
	     	zjlqsj_name: "请输入姓名",
	     	zjlqsj_password:{
	      		required:"请输入密码",
	      		rangelength:$.validator.format("请输入6-20个字母或数字"),
	      	},
	    }
	});
	$.validator.setDefaults({
	    submitHandler: function() {
	      layer.closeAll();
	       layer.open({
		   		type:1,
		   		title:'推荐领赏金',
		   		area:['80%'],
		   		closeBtn:1,
		   		shadeClose: true,
		  		skin: 'layer-ext-mylayer',
		  		content:$('.fzlj')
	   		});
	    }
	});
	$("#tjlsj_signupForm").validate({
	    rules: {
		    tjlsj_tel: "required",
		},
	  	messages: {
	    	tjlsj_tel: "您输入的手机号码是错误的",
	    }
	});
	$("#cktjjl_signupForm").validate({
	    rules: {
		    cktjjl_tel: "required",
		},
	  	messages: {
	    	cktjjl_tel: "您输入的手机号码是错误的",
	    }
	});

    	$('#imgtips').click(function(){
	    	$('#imgtips').attr('src', 'http://sso.veryeast.cn/user/captcha?t=' + (new Date).getTime());
	    }).click();


	    var vcode_timer;
	    function vcode_status(status) {
	    	init();
	    	function init() {
	    		clearInterval(vcode_timer);
				// 提示重新发送
				$('#telyz_mob').html('获取验证码').removeClass('active');
	    	}

	    	if (status) {
	    		var vcode_time_end = 60;
	    		vcode_timer = setInterval(function () {
		    		if (vcode_time_end > 0) {
		    			vcode_time_end--;
		    			// 倒计时
		    			$('#telyz_mob').html(vcode_time_end + ' 秒').addClass('active').css;
		    		} else {
		    			init();
		    		}
		    	}, 1000);
	    	}
	    }


    $.validator.addMethod("validateMobile",function(value,element,params){
		if(!/^1(3|4|5|7|8)\d{9}$/.test(mobile)){
			return false;
		}else{
			return true;
		}
		},"error");

    })

$('.close').click(function() {
    $('#signup-modal').modal('hide');
    $('#login-modal').modal('hide');
});
function deleteVideo(id){
  var erro = sessionStorage.getItem('error');
  // var userId = sessionStorage.getItem('userId');
  if (!confirm("Do you want to delete this Video")){
      return false;
    }
    if(erro != 1){
      id = "";
      userId = 0;
      $(".video_msg").fadeIn(1000, function(){      
    $(".errs_del").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Please login then try to Delete !</div>'); 
         });
    }else{
      var userId = sessionStorage.getItem('userId');
    }
	$.ajax({ 
   type : 'GET',
   url  : 'action.php?deleteVideo=deleteVideo&id='+id+'&userId='+userId,  
   success :  function(response)
      {      
        var resp = JSON.parse(response);
        console.log("delete  ",resp);
        console.log(resp.errs_del);
     if(resp.errs_del=="1"){
        var htm = "";
        // sessionStorage.setItem("error", res.error);
       $(".video_msg").fadeIn(1000, function(){      
    $(".errs_del").html('<div class="alert alert-success"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+resp.message+' !</div>');
            
         }); 
       setTimeout(' window.location.href = "index.html"; ',1000); 
     }
     else{ 
      $(".video_msg").fadeIn(1000, function(){      
    $(".errs_del").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+resp.message+' !</div>'); 
         });
     }
     }
   }); 
	console.log("ccxc, ",id);
}
function viewVideo(id){
	console.log("ddddd ",id);
 		$.ajax({ 
   type : 'GET',
   url  : 'action.php?viewVideo=viewVideo&id='+id,  
   success :  function(response)
      {      
        var resp = JSON.parse(response);
        console.log("list  ",resp);
        console.log(resp);
     if(resp.errs=="1"){
     	console.log(resp.video.vlocation);
     	$(".portfolio-item").hide();
        var htm = '<div class="col-md-8"><video id="myVideo1" width="700" height="500" controls><source src="'+resp.video.vlocation+'" type="video/webm">Your browser does not support the video tag.</video></div>'; 
        var name = resp.video.vname+" Video"; 
        $(".page-header").html(name)
        $("#add_video_links").html(htm);
          
     }
     else{
         
      $("#error").fadeIn(1000, function(){      
    $("#error_resp").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+resp.data.msg1+' !</div>');
           $("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
         });
     }
     }
   }); 
 	}
    $('document').ready(function()
    { 
        var erro = sessionStorage.getItem('error');
        if(erro == "1"){
          $(".dlt").removeAttr("style");
            $( ".nav.navbar-nav > li:nth-child(2), .nav.navbar-nav > li:nth-child(3)" ).addClass( "afterlogin" );
            $( ".nav.navbar-nav > li:nth-child(4), .nav.navbar-nav > li:nth-child(5), .nav.navbar-nav > li:nth-child(4)> a, .nav.navbar-nav > li:nth-child(5)> a" ).addClass( "loginsuccess" );
            
        }
        console.log("errr ",erro);

$.ajax({ 
   type : 'GET',
   url  : 'action.php?videolist=videolist',  
   success :  function(response)
      {      
        var resp = JSON.parse(response);
        console.log("list  ",resp);
        console.log(resp.data.err);
     if(resp.data.err=="1"){
        var htm = "";
        // sessionStorage.setItem("error", res.error);
        $.each( resp.data.list, function( key, value ) {
            htm += '<div class="col-md-4 portfolio-item"><div class="videff"><div class="wrapper"><video id="myVideo" width="361" height="240" controls><source src="'+value.vlocation+'" type="video/webm">Your browser does not support the video tag.</video><div class="playpause"><span class="glyphicon glyphicon-play-circle" onclick="viewVideo('+value.id+')"></span></div></div><span class="vnam">'+value.vname+'</span> <span id="dltVideo" onclick="deleteVideo('+value.id+')" class="glyphicon glyphicon-trash dlt" aria-hidden="true"></span></div></div>'
          console.log( key + ": " + value.vlocation );
        });
        $("#add_video_links").html(htm);
        var vids = $("video"); 
    		$.each(vids, function(){
    		       this.controls = false; 
    		}); 
         console.log(resp.data.err);   
     }
     else{
         
      $("#error").fadeIn(1000, function(){      
    $("#error_resp").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+resp.data.msg1+' !</div>');
           // $("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
         });
     }
     }
   }); 
     /* validation */
  $("#login-form").validate({
      rules:
   {
   password: {
   required: true,
   },
   user_email: {
            required: true,
            email: true
            },
    },
       messages:
    {
            password:{
                      required: "please enter your password"
                     },
            user_email: "please enter your email address",
       },
    submitHandler: loginForm 
       });  
    /* validation */
    
    /* login submit */
    function loginForm()
    {  
   var data = $("#login-form").serialize();
    
   $.ajax({
    
   type : 'POST',
   url  : 'action.php?login=login',
   data : data,
   beforeSend: function()
   { 
    $("#error").fadeOut();
    $("#btn-login").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
   },
   success :  function(response)
      {      
        var res = JSON.parse(response);
        console.log(res);
     if(res.error=="1"){
        sessionStorage.setItem("error", res.error);
        sessionStorage.setItem("userId", res.unserInfo.id);
        
         console.log(res.error);
      $("#btn-login").html('<img src="btn-ajax-loader.gif" /> &nbsp; Signing In ...');
      // $("#login-modal").css('display','none');
     // setTimeout(' window.location.href = "index.html"; ',4000); 
     }
     else{
         
      $("#error").fadeIn(1000, function(){      
    $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+res.msg+' !</div>');
           $("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
         });
     }
     }
   });
    return false;
  }
    /* login submit */
    /* Signup Form */
    $("#signup-form").validate({
      rules:
   {
   password: {
   required: true,
   },
   name: {
            required: true 
            },
   email: {
            required: true 
            },
    },
       messages:
    {
            password:{
                      required: "please enter your password"
                     },
            email:{
                     required: "please enter your email address"
                    },
            name:{
                required: "please enter your Name"
            } 
       },
    submitHandler: signupForm 
       }); 
    function signupForm()
    {  
   var data = $("#signup-form").serialize();
   var base64image =  document.getElementById("imageprev").src;
   data['profilepic'] = base64image;
    console.log(data);
   $.ajax({
    
   type : 'POST',
   url  : 'action.php?signup=signup',
   data : data,
   beforeSend: function()
   { 
    $("#error1").fadeOut();
    $("#btn-signup").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
   },
   success :  function(response)
      {      
        var res = JSON.parse(response);
        console.log(res.error);
     if(res.error=="1"){
         
      $("#btn-signup").html('<img src="btn-ajax-loader.gif" /> &nbsp; Signup In ...');
      setTimeout(' window.location.href = "index.html"; ',4000);
     }
     else{
         
      $("#error1").fadeIn(1000, function(){      
    $("#error1").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response+' !</div>');
           $("#btn-signup").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign Up');
         });
     }
     }
   });
    return false;
  }
  $("#logout").one("click", function(){
     sessionStorage.clear();
    setTimeout(' window.location.href = "index.html"; ',500); 
  })
  $('#email').on('change',function(){
    var data = {"email":$("#email").val()};
    console.log('datadd ',data);
    $.ajax({
    
   type : 'POST',
   url  : 'action.php?checkemail=checkemail',
   data : data,
   beforeSend: function()
   { 
    $("#error1").fadeOut();
    $("#btn-login").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
   },
   success :  function(response)
      {      
        var res = JSON.parse(response);
        console.log(res.error);
     if(res.error=="1"){
        /*$("#error1").html('<div class="alert alert-warning"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+res.msg+' !</div>');*/
        $("#check-e1").fadeOut(1000,function(){
            $("#check-e1").css("color","green");
            $("#check-e1").html(res.msg);
        }); 
     }
     else{ 
      $("#error1").fadeIn(1000, function(){      
          $("#error1").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+res.msg+' !</div>'); 
         });
     }
     }
   }); 
  })
});
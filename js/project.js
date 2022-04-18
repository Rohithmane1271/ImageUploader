// alert(11)
//do register process using ajax
$(document).ready(function(){
    // alert("loaded");
    $(".register-button").click(function(){
        // alert("clicked");
        var dataRegister = $("#registerForm").serialize();
        // alert(dataRegister)
        $.ajax({
            type:"post",
            data:dataRegister,
            url:"/register-action",
            success:function(resFromServer){
                console.log("Data from /register-action")
                console.log(resFromServer); //{msg:''}
                //u will be having values from node js from /register-action
                $(".errMsgRegister").html(resFromServer['msg'])
            },
            error:function(err){
                console.log(err)
            }
        });
    })
})
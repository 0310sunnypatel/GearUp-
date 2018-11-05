function validateNumber(){
    var mobileNumber=$("#mobNumber").val();
    if(mobileNumber.length<10){
        document.getElementById("message").innerHTML="Enter a valid contact number";
        document.getElementById("message").style="display:block";
    }
}

function validatePassword(){
    var password = $("#txtPassword").val();
    var passw= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(!(password.match(passw))) {
        document.getElementById("message").innerHTML="Password should contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
        document.getElementById("message").style="display:block";
    }
    if(password.length < 8) {
        document.getElementById("message").innerHTML="Password length must me more than 8";
    }
}
function validateRePassword(){
    var password = $("#txtPassword").val();
    var password1 = $("#txtPassword1").val();
    if (password1 === undefined || password1 === null || password1 === "") {
        document.getElementById("message").innerHTML="Enter password again";
        document.getElementById("message").style="display:block";
    }
    if(password !== password1) {
        document.getElementById("message").innerHTML="Passwords do not match!";
        document.getElementById("message").style="display:block"; 
    }
}
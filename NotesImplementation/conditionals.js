"use script";
// let result = prompt("what is your age sir: ");
// if(result == null || result == ""){//if clicked ok without entering anything,or if clicked cancel
//     alert("sir please pay respects");
// }
// else if( !(result<=90) || !(result >=14)){
//     alert("good to see you sir");
// }
// else{
//     alert("damn that is some age");
// }

let user = prompt("Good day sir/mam , what is your name: ");
if(user == "Admin"){
    let password = prompt("Password: ");
    if(password == "bazooka"){
        alert("Welcome sir/mam");
    }
    else if(password == "" || password == null){
        alert("Canceled");
    }
    else{
        alert("Incorrect password");
    }
}
else if(user == "" || user == null){
    alert("Cancelled");
}
else{
    alert("I don't know you sir");
}
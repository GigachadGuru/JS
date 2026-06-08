"use strict";
/**
 *  Password Strength Checker
 * Write a password validator that checks a given password string against 5 rules and rates its strength.
Rules

    At least 8 characters long
    Contains at least one uppercase letter (A–Z)
    Contains at least one lowercase letter (a–z)
    Contains at least one digit (0–9)
    Contains at least one special character from !@#$%^&*

Strength rating

    0–2 rules passed → Weak
    3–4 rules passed → Medium
    5 rules passed → Strong

 */


//------------------------------------------------------------------------------------

//                       PASSWORD STRENGTH CHECKER

let password = prompt("Please enter your password");
let special = ['!','@','#','$','%','^','&','*'];


//or maybe just use length function
function checkUpper(password){
    let containsUpper = (password != password.toLowerCase()) ;//special characters , white spaces remains the same
    return containsUpper;
}
function checkLower(password){
    let containsLower = (password != password.toUpperCase()) ;//special characters , white spaces remains the same
    return containsLower;
}
function containsDigit(password){
    for(const char of password){
        if(char != " "){
            if(!isNaN(char)) return true;//since " " possiblity is eliminated, and the special characters and alphabets all give NaN
        }// any thing != NaN , even NaN itself
    }
    return false;
}

function containsSpecial(password){
    for(const char of password){
        for(const char2 of special){
            if(char == char2){
                return true;
            }
        }
    }
    return false;
}
function checkPassword(password){
    let count =0;
    if((password.length)>=8) count++;
    if(checkUpper(password)) count++;
    if(checkLower(password)) count++;
    if(containsDigit(password)) count++;
    if(containsSpecial(password))count++;
    switch(count){
        case 0:
        case 1:
        case 2:
            alert("Weak Strength Password");
            break;
        case 3:
        case 4:
            alert("Medium Strength Password");
            break;
        case 5:
            alert("Strong Strength Password");
            break;
    }

}
checkPassword(password);
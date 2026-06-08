"use strict";
// let sum = function(){
//     return 2;
// };
// let sum2 = (arg1,arg2) => arg1+arg2;
// alert(sum());
// alert(sum2(12,12));
//the + operator tries to convert the undefined into a number but since there si no number possible thats why it assigns a NaN to it
//A NaN , short abrreviation for Not a Number
let yes = function(){
    alert("Hello brother");
};
let no = function(){
    alert("Get lost");
}



let agree = (question,yes,no) => {
    if (confirm(question)){
        yes();
    }
    else{
        no();
    }
};

agree("Do you agree",yes,no);

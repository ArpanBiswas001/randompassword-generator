const inputSlider=document.querySelector("[data-length-slider]")
const lengthDisplay=document.querySelector("[data-length-Number]")

const datapasswordDisplay=document.querySelector("[data-passwordDisplay]")
const copyButton=document.querySelector("[copyButton]")
const datacopyMsg=document.querySelector("[datacopyMsg]")

const uppercase=document.querySelector("#uppercase")
const lowercase=document.querySelector("#lowercase")
const number=document.querySelector("#number")
const symbol=document.querySelector("#symbol")

const strength=document.querySelector(".strength-indicator")
const generateButton=document.querySelector(".generate-password")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")

const symbols=",.<>/?;:'[]{}\|=+-_*&^%$#@!"
let password=""
let passwordLength=10
let checkCount=0

setIndicator("#ccc");
handleSlider();

function handleSlider() {
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";

}

function shufflePassword(points){
    for (let i = points.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = points[i];
        points[i] = points[j];
        points[j] = k;
      }
      let str="";
      points.forEach(e=>{
        str+=e;
      })
    return str;
}
function randomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function randomNumber(){
    return randomInteger(0,9);
}

function randomLowercase() {
    return String.fromCharCode(randomInteger(97,123));
}

function randomUppercase() {
    return String.fromCharCode(randomInteger(65,91));
}

function randomSymbol() {
    let randomn=randomInteger(0,symbols.length)
    return symbols.charAt(randomn);
}

function setIndicator(color){
    strength.style.backgroundColor=color;
    strength.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function  passwordStrength() {
    let uppercaseCheck=false;
    let lowercaseCheck=false;
    let numberCheck=false;
    let symbolCheck=false;

    if(uppercase.checked) uppercaseCheck=true;
    if(lowercase.checked) lowercaseCheck=true;
    if(number.checked) numberCheck=true;
    if(symbol.checked) symbolCheck=true;

    if(uppercaseCheck && lowercaseCheck && numberCheck && symbolCheck && passwordLength>=8)
        setIndicator("#0f0");
    else if((uppercaseCheck || lowercaseCheck) && (numberCheck || symbolCheck) && passwordLength>=6)
        setIndicator("#ff0");
    else
        setIndicator("#f00");
}

async function copyContent() {
   try {
        await navigator.clipboard.writeText(datapasswordDisplay.value);
        datacopyMsg.innerText="copied";
   } catch (error) {
        datacopyMsg.innerText="failed";
   }
   datacopyMsg.classList.add("active");

   setTimeout(() => {
        datacopyMsg.classList.remove("active"); 
   }, 2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyButton.addEventListener('click',(e)=>{
    if(datapasswordDisplay.value)
            copyContent();
})

function handleCheckBoxCount() {
    checkCount=0;

    allCheckBox.forEach(element => {
        if(element.checked)
                checkCount++;
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxCount);
})
generateButton.addEventListener('click',(e)=>{
    if(checkCount<=0)
        return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    // if(uppercase.checked)
    //     password+=randomUppercase();
    // if(lowercase.checked)
    //     password=randomLowercase();
    // if(number.checked)
    //     password+=randomNumber();
    // if(symbol.checked)
    //     password+=randomSymbol();
    
    let arr=[];
    if(uppercase.checked)
        arr.push(randomUppercase);
    if(lowercase.checked)
        arr.push(randomLowercase);
    if(number.checked)
        arr.push(randomNumber);
    if(symbol.checked)
        arr.push(randomSymbol);
    for(let i=0;i<arr.length;i++){
        password+=arr[i]();
    }
    let remaining=passwordLength-arr.length;

    for(let i=0;i<remaining;i++){
        let randomIndex=randomInteger(0,arr.length);
        password+=arr[randomIndex]();
    }

    password=shufflePassword(Array.from(password));
    datapasswordDisplay.value=password;
    passwordStrength();
})
//validation
const patternPhoneError = document.getElementById("pattern-phone-error");
const patternPhoneCodeError = document.getElementById("pattern-phone-code-error");
const emptyPhoneError = document.getElementById("empty-phone-error")
const emptyPhoneCodeError = document.getElementById("empty-phone-code-error");

export const getValidateField =(phone, phoneCode) => {
    const phoneValue = phone.value;
    const phoneCodeValue = phoneCode.value;
    const phoneEx = /^[0-9 ()]+$/;
    const phoneCodeEx = /^[0-9 +]+$/;
    var phoneResult = phoneEx.test(phoneValue);
    var phoneCodeResult = phoneCodeEx.test(phoneCodeValue);

    if(phoneValue.length < 1) {
        console.log("phoneValue.length < 1")
        patternPhoneError.style.display = "none";
        emptyPhoneError.style.display = "block";
        phone.setAttribute("data-error", "true");
    }else{
        emptyPhoneError.style.display = "none";
        phone.setAttribute("data-error", "false");

    }
    if(phoneCodeValue.length < 1) {
        console.log("phoneCodeValue.length < 1")
        patternPhoneCodeError.style.display = "none";
        emptyPhoneCodeError.style.display = "block";
        phoneCode.setAttribute("data-error", "true");
    }else{
        emptyPhoneCodeError.style.display = "none";
        phoneCode.setAttribute("data-error", "false");
    }
    if(!phoneResult){
        if(phoneValue.length > 0){
            patternPhoneError.style.display = "block";
            phone.setAttribute("data-error", "true");
        }
    }else{
        patternPhoneError.style.display = "none";
        phone.setAttribute("data-error", "false");
    }

    if(!phoneCodeResult){
        if(phoneCodeValue.length > 0) {
            patternPhoneCodeError.style.display = "block";
            phoneCode.setAttribute("data-error", "true");
        }
    }else{
        patternPhoneCodeError.style.display = "none";
        phoneCode.setAttribute("data-error", "false");
    }
    getRidOfEmptyFieldError([phone, phoneCode]);
}

const getRidOfEmptyFieldError =(data=[])=> {
    data.forEach(item => {
        item.addEventListener("keyup", function(e){
            if(e.target.id=="card-phone"){
                emptyPhoneError.style.display = "none";
                // e.target.setAttribute("data-error", "false")
            }else{
                emptyPhoneCodeError.style.display = "none";
                // e.target.setAttribute("data-error", "false")
            }
        })
    })
}
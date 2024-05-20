const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const titleText = document.querySelector(".title-text");
const formContainer = document.querySelector(".form-container");
const usernameInputLogin = document.querySelector(".login input[type='text']");
const passwordInputLogin = document.querySelector(".login input[type='password']");
const usernameErrorLogin = document.getElementById("login-username-error");
const passwordErrorLogin = document.getElementById("login-password-error");
const usernameInput = document.querySelector(".signup input[type='text'][placeholder='Username']");
const emailInput = document.querySelector(".signup input[type='text'][placeholder='Email Address']");
const passwordInputs = document.querySelectorAll(".signup input[type='password']");
const passwordInputSignup = passwordInputs[0];
const confirmPasswordInput = passwordInputs[1];
const usernameError = document.getElementById("signup-username-error");
const emailError = document.getElementById("signup-email-error");
const passwordError = document.getElementById("signup-password-error");
const confirmPasswordError = document.getElementById("signup-confirm-password-error");

const minPasswordLength = 6;
const minUsernameLength = 3;
const maxUsernameLength = 15;


function updateValidation(input, errorElement, errorMessage, isValid) {
    if (!isValid) {
        errorElement.innerText = errorMessage;
        input.classList.remove("valid");
        input.classList.add("invalid");
    } else {
        errorElement.innerText = "";
        input.classList.remove("invalid");
        input.classList.add("valid");
    }

    return isValid;
}


function validateInput(value, input, errorElement, errorMessage) {
    const isValid = value.trim() !== "";
    return updateValidation(input, errorElement, errorMessage, isValid);
}


function validateLoginForm(formData) {

    const usernameValid = validateInput(formData.get("usernameInputLogin"), usernameInputLogin, usernameErrorLogin, "Please enter your username.");
    const passwordValue = formData.get("passwordInputLogin").trim();
    const passwordValid = validateInput(passwordValue, passwordInputLogin, passwordErrorLogin, "Please enter your password.");

    if (passwordValid && passwordValue.length < minPasswordLength) {
        passwordErrorLogin.innerText = "Password must be at least " + minPasswordLength + " characters.";
        passwordInputLogin.classList.remove("valid");
        passwordInputLogin.classList.add("invalid");
        return false;
    }
    if(passwordValid && passwordValue.length > minPasswordLength) {
        passwordInputLogin.classList.remove("invalid");
        passwordInputLogin.classList.add("valid");
    }

    return usernameValid && passwordValid && passwordValue.length >= minPasswordLength;
}

function validateSignupForm(formData) {

    const usernameValid = validateInput(formData.get("signup-username"), usernameInput, usernameError, "Please enter your username.");
    const emailValid = validateInput(formData.get("signup-email"), emailInput, emailError, "Please enter your email address.");
    const passwordValue = formData.get("passwordInput").trim();
    const passwordValid = validateInput(passwordValue, passwordInputSignup, passwordError, "Please enter your password.");
    const confirmPasswordValue = formData.get("confirmPasswordInput").trim();
    const confirmPasswordValid = validateInput(confirmPasswordValue, confirmPasswordInput, confirmPasswordError, "Please confirm your password.");


    if (usernameValid && (formData.get("signup-username").trim().length < minUsernameLength || formData.get("signup-username").trim().length > maxUsernameLength)) {
        usernameError.innerText = "Username must be between 3 and 15 characters.";
        usernameInput.classList.remove("valid");
        usernameInput.classList.add("invalid");
        return false;
    }
    else if(usernameValid && (formData.get("signup-username").trim().length > minUsernameLength || formData.get("signup-username").trim().length < maxUsernameLength)){
        usernameInput.classList.remove("invalid");
        usernameInput.classList.add("valid");
    }

    if (passwordValid && passwordValue.length < minPasswordLength) {
        passwordError.innerText = "Password must be at least " + minPasswordLength + " characters.";
        passwordInputSignup.classList.remove("valid");
        passwordInputSignup.classList.add("invalid");
        return false;
    }

    if (confirmPasswordValid && confirmPasswordValue !== passwordValue) {
        confirmPasswordError.innerText = "Passwords do not match.";
        confirmPasswordInput.classList.remove("valid");
        confirmPasswordInput.classList.add("invalid");
        return false;
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if (emailValid && !isValidEmail(formData.get("signup-email").trim())) {
        emailError.innerText = "Enter valid email.";
        emailInput.classList.remove("valid");
        emailInput.classList.add("invalid");
        return false;
    }

    return usernameValid && emailValid && passwordValid && confirmPasswordValid;
}







function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form); // Перереоблено на Форм Дата
    const isValid = form.classList.contains('login') ? validateLoginForm(formData) : validateSignupForm(formData);

    if (!isValid) {
        return;
    }
    const userData = {
        username: formData.get('usernameInputLogin') || formData.get('signup-username'),
        password: formData.get('passwordInputLogin') || formData.get('passwordInput'),
        email: formData.get('signup-email')
    };

    localStorage.setItem('user', JSON.stringify(userData));
    console.log(userData);

    titleText.classList.add("blur");
    formContainer.classList.add("blur");
    document.getElementById("loader").classList.remove("hide-loader");

    simulateDataSubmission()  //якшошо функція винесена за межі іншої
        .then(() => {
            form.reset();
            removeValidClasses(form);
            document.getElementById("loader").classList.add("hide-loader");
            document.getElementById("message").classList.remove("hide-message");

            setTimeout(() => {
                document.getElementById("message").classList.add("hide-message");

                titleText.classList.remove("blur");
                formContainer.classList.remove("blur");

                window.location.href = "index2.html";

            }, 2000);



        })
        .catch(error => {
            alert('Error: ' + error.message);
            titleText.classList.remove("blur");
            formContainer.classList.remove("blur");
        })
        .finally(() => {
            document.getElementById("loader").classList.add("hide-loader");
        });
}

function removeValidClasses(form) {
    const validElements = form.querySelectorAll('.valid');
    validElements.forEach(element => {
        element.classList.remove('valid');
    });
}

function simulateDataSubmission() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1500);
    });
}

function passwordVisibility(event) {
    if (event.target.classList.contains("togglePassword")) {
        const passwordInput = event.target.parentElement.querySelector("input");
        if (passwordInput && (passwordInput.type === "password" || passwordInput.type === "text")) {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                event.target.classList.remove("fa-eye-slash");
                event.target.classList.add("fa-eye");
            } else {
                passwordInput.type = "password";
                event.target.classList.remove("fa-eye");
                event.target.classList.add("fa-eye-slash");
            }
        }
    }
}


signupBtn.onclick = (()=>{
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
    signupBtn.click();
    return false;
});


document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".form-inner").addEventListener("click", passwordVisibility);
});

document.querySelector(".form-inner").addEventListener("submit", handleFormSubmit);

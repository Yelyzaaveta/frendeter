const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const titleText = document.querySelector(".title-text");
const formContainer = document.querySelector(".form-container");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

function isValidEmail(email) {
    return emailRegex.test(email);
}


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

function validateInput(input, errorElement, errorMessage) {
    const value = input.value.trim();
    const isValid = value !== "";
    return updateValidation(input, errorElement, errorMessage, isValid);
}

function validateLoginForm() {

    const usernameValid = validateInput(usernameInputLogin, usernameErrorLogin, "Please enter your username.");
    const passwordValid = validateInput(passwordInputLogin, passwordErrorLogin, "Please enter your password.");

    if (passwordValid && passwordInputLogin.value.trim().length < 6) {
        passwordErrorLogin.innerText = "Password must be at least 6 characters.";
        passwordInputLogin.classList.remove("valid");
        passwordInputLogin.classList.add("invalid");
        return false;
    }

    return usernameValid && passwordValid;
}

function validateSignupForm() {
    const usernameValid = validateInput(usernameInput, usernameError, "Please enter your username.");
    const emailValid = validateInput(emailInput, emailError, "Please enter your email address.");
    const passwordValid = validateInput(passwordInputs[0], passwordError, "Please enter your password.");
    const confirmPasswordValid = validateInput(passwordInputs[1], confirmPasswordError, "Please confirm your password.");

    if (usernameValid && (usernameInput.value.trim().length < 3 || usernameInput.value.trim().length > 15)) {
        usernameError.innerText = "Username must be between 3 and 15 characters.";
        usernameInput.classList.remove("valid");
        usernameInput.classList.add("invalid");
        return false;
    }

    if (passwordValid && passwordInputs[0].value.trim().length < 6) {
        passwordError.innerText = "Password must be at least 6 characters.";
        passwordInputSignup.classList.remove("valid");
        passwordInputSignup.classList.add("invalid");
        return false;
    }

    if (confirmPasswordValid && passwordInputs[1].value.trim() !== passwordInputs[0].value.trim()) {
        confirmPasswordError.innerText = "Passwords do not match.";
        confirmPasswordInput.classList.remove("valid");
        confirmPasswordInput.classList.add("invalid");
        return false;
    }
    if (emailValid && !isValidEmail(emailInput.value.trim())) {
        emailError.innerText = "Enter valid email.";
        emailInput.classList.remove("valid");
        emailInput.classList.add("invalid");
        return false;
    }
    return usernameValid && emailValid && passwordValid && confirmPasswordValid;
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
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const isValid = form.classList.contains('login') ? validateLoginForm() : validateSignupForm();

    if (!isValid) {
        return;
    }

    titleText.classList.add("blur");
    formContainer.classList.add("blur");
    document.getElementById("loader").classList.remove("hide-loader");

    simulateDataSubmission()
        .then(() => {
            form.reset();
            removeValidClasses(form);
            document.getElementById("loader").classList.add("hide-loader");
            document.getElementById("message").classList.remove("hide-message");

            setTimeout(() => {
                document.getElementById("message").classList.add("hide-message");
                titleText.classList.remove("blur");
                formContainer.classList.remove("blur");
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

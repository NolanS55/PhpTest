import {
  showError,
  clearError,
  validatePasswordStrength,
  validatePasswords,
  validatePasswordNotExposed,
  validateText,
  validateNumbers,
  checkEmpty,
} from './validation.js';

const form = document.getElementById("regForm");

const userName = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const fullName = document.getElementById("fullName");
const title = document.getElementById("title");

const phone = document.getElementById("phone");
const extension = document.getElementById("extension");

const email = document.getElementById("email");

userName.addEventListener("input", () => validatePasswordNotExposed(userName, password));

password.addEventListener("input", () => validatePasswordStrength(password));
password.addEventListener("input", () => validatePasswords(password, confirmPassword));
confirmPassword.addEventListener("input", () => validatePasswords(password, confirmPassword));

fullName.addEventListener("input", () => validateText(fullName));
title.addEventListener("input", () => validateText(title));

phone.addEventListener("input", () => validateNumbers(phone));
extension.addEventListener("input", () => validateNumbers(extension));

email.addEventListener("input", () => validatePasswordNotExposed(email, password));


const titleField = document.getElementById('contactTitle');
titleField.style.display = 'none';

const allInputs = form.querySelectorAll("input, select");


allInputs.forEach((input) => {
  input.addEventListener("blur", () => checkEmpty(input));
});

document.getElementById('accountType').addEventListener('change', function () {
  const label = document.getElementById('fullNameLabel');

  if (this.value === 'Company') {
    label.textContent = 'Contact Name:';
    titleField.style.display = 'block';
  } else {
    label.textContent = 'Full Name:';
    titleField.style.display = 'none';
  }
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  let hasErrors = false;

  allInputs.forEach((input) => {
    if (input.required && input.value.trim() === "") {
      showError(input, "This field cannot be blank");
      hasErrors = true;
    }
  });

  validatePasswordStrength(password);
  validatePasswords(password, confirmPassword);
  validateText(fullName);
  validateText(title);
  validateNumbers(phone);
  validateNumbers(extension);
  validatePasswordNotExposed(userName, password);
  validatePasswordNotExposed(email, password);

  if (form.querySelector(".error-message")) {
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  const formData = new FormData(this);

  const response = await fetch('/server.php', {
    method: 'POST',
    body: formData,
    credentials: "include"
  });

  const result = await response.json();

  const messageBox = document.getElementById('responseMessage');
  messageBox.textContent = '';

  if (result.success) {
    const now = new Date();
    messageBox.style.color = 'green';
    messageBox.textContent = result.message + " at " + now.toString();
    alert("Registration successful : " + result.message);

    form.reset();
    titleField.style.display = 'none';

    const minLength = document.getElementById("minLength");
    const uppercase = document.getElementById("uppercase");
    const lowercase = document.getElementById("lowercase");
    const number = document.getElementById("number");
    const specialChar = document.getElementById("specialChar");

    minLength.style.color = "#cf282c";
    uppercase.style.color = "#cf282c";
    lowercase.style.color = "#cf282c";
    number.style.color = "#cf282c";
    specialChar.style.color = "#cf282c";

    allInputs.forEach((input) => {
      clearError(input);
    });

    if (result.updatedToken) {
      const tokenStorage = document.querySelector('input[name="token"]');
      if (tokenStorage) {
        tokenStorage.value = result.updatedToken;
      }
    }
  } else {
    messageBox.style.color = '#cf282c';
    messageBox.textContent = result.message;
    alert(result.message);
  }
});
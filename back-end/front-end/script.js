const form = document.getElementById("regForm");

const userName = document.getElementById("username");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const fullName = document.getElementById("fullName");

const title = document.getElementById("title");

const phone = document.getElementById("phone");
const extension = document.getElementById("extension");

const email = document.getElementById("email");

userName.addEventListener("input", () => validatePasswordNotExposed(userName));

password.addEventListener("input", validatePasswordStrength);
password.addEventListener("input", validatePasswords);
confirmPassword.addEventListener("input", validatePasswords);

fullName.addEventListener("input", () => validateText(fullName));

title.addEventListener("input", () => validateText(title));

phone.addEventListener("input",() => validateNumbers(phone));
extension.addEventListener("input",() => validateNumbers(extension));

email.addEventListener("input", () => validatePasswordNotExposed(email));

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
  let hasErrors = false;
  e.preventDefault();

  allInputs.forEach((input) => {
    if (input.required && input.value.trim() === "") {
      showError(input, "This field cannot be blank");
      hasErrors = true;
    }
  });

  validatePasswordStrength()
  validatePasswords();
  validateText(fullName);
  validateText(title);
  validateNumbers(phone);
  validateNumbers(extension);

  validatePasswordNotExposed(userName);
  validatePasswordNotExposed(email)

  if (form.querySelector(".error-message")) {
    hasErrors = true;
    e.preventDefault();
    return;
  }

  const formData = new FormData(this);
  const response = await fetch('/server.php', {
    method: 'POST',
    body: formData,
    credentials: "include"
  });

  const result = await response.json();

  const messageBox = document.getElementById('responseMessage')
  messageBox.textContent = '';
    if (result.success) {
        const now = new Date();
        messageBox.style.color = 'green';
        messageBox.textContent = result.message + " at " + now.toString();
        alert("Registration successful : " + result.message);

        form.reset();
        titleField.style.display = 'none';
        
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
        messageBox.style.color = 'red';
        messageBox.textContent = result.message;
        alert(result.message);
    }
});


function showError(input, message) {
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains("error-message")) {
    error = document.createElement("div");
    error.classList.add("error-message");
    input.insertAdjacentElement("afterend", error);
  }
  error.textContent = message;
}

function clearError(input) {
  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-message")) {
    error.remove();
  }
}

function validatePasswordStrength() {
  const value = password.value;

  const minLength = document.getElementById("minLength");
  const uppercase = document.getElementById("uppercase");
  const lowercase = document.getElementById("lowercase");
  const number = document.getElementById("number");
  const specialChar = document.getElementById("specialChar");

  if (value.length >= 8) {
    minLength.style.color = "green";
  } else {
    minLength.style.color = "#cf282c";
  }

  if (/[A-Z]/.test(value)) {
    uppercase.style.color = "green";
  } else {
    uppercase.style.color = "#cf282c";
  }

  if (/[a-z]/.test(value)) {
    lowercase.style.color = "green";
  } else {
    lowercase.style.color = "#cf282c";
  }

  if (/\d/.test(value)) {
    number.style.color = "green";
  } else {
    number.style.color = "#cf282c";
  }

  if (/[@$!%*#?&]/.test(value)) {
    specialChar.style.color = "green";
  } else {
    specialChar.style.color = "#cf282c";
  }

  const allValid =
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[@$!%*#?&]/.test(value);

  if (!allValid) {
    showError(password, "Password does not meet the required criteria");
  } else {
    clearError(password);
  }
}

function validatePasswords() {
  if (password.value && confirmPassword.value) {
    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Passwords do not match");
    } else {
      clearError(confirmPassword);
    }
  } else {
    clearError(confirmPassword);
  }
}

function validatePasswordNotExposed(inputElement) {
  const passwordValue = password.value;
  const inputValue = inputElement.value;

  if (inputValue.toLowerCase().includes(passwordValue.toLowerCase()) && passwordValue.length > 0) {
    showError(inputElement, "This field contains your password!");
    return false;
  } else {
    clearError(inputElement);
    return true;
  }
}

function validateText(inputElement) {
  const nameRegex = /^[a-zA-Z' -]+$/;
  const inputValue = inputElement.value.trim();

  if (inputValue && !nameRegex.test(inputValue)) {
    showError(inputElement, "Only letters, apostrophes (') and hyphens (-) are allowed.");
  } else {
    clearError(inputElement);
  }
}

function validateNumbers(inputElement) {
  const numberRegex = /^[0-9]+$/;
  if (inputElement.value && !numberRegex.test(inputElement.value)) {
    showError(inputElement, "This field can only contain numbers");
  } else {
    clearError(inputElement);
  }
}
function checkEmpty(input) {
  if (input.required && input.value.trim() === "") {
      showError(input, "This field cannot be blank");
    } else {
      clearError(input);
    }
}



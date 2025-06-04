export function showError(input, message) {
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains("error-message")) {
    error = document.createElement("div");
    error.classList.add("error-message");
    input.insertAdjacentElement("afterend", error);
  }
  error.textContent = message;
}

export function clearError(input) {
  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-message")) {
    error.remove();
  }
}

export function validatePasswordStrength(passwordInput) {
  const value = passwordInput.value;

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
    showError(passwordInput, "Password does not meet the required criteria");
  } else {
    clearError(passwordInput);
  }
}

export function validatePasswords(passwordInput, confirmPasswordInput) {
  if (passwordInput.value && confirmPasswordInput.value) {
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Passwords do not match");
    } else {
      clearError(confirmPasswordInput);
    }
  } else {
    clearError(confirmPasswordInput);
  }
}

export function validatePasswordNotExposed(inputElement, passwordInput) {
  const passwordValue = passwordInput.value;
  const inputValue = inputElement.value;

  if (inputValue.toLowerCase().includes(passwordValue.toLowerCase()) && passwordValue.length > 0) {
    showError(inputElement, "This field contains your password!");
    return false;
  } else {
    clearError(inputElement);
    return true;
  }
}

export function validateText(inputElement) {
  const nameRegex = /^[a-zA-Z' -]+$/;
  const inputValue = inputElement.value.trim();

  if (inputValue && !nameRegex.test(inputValue)) {
    showError(inputElement, "Only letters, apostrophes (') and hyphens (-) are allowed.");
  } else {
    clearError(inputElement);
  }
}

export function validateNumbers(inputElement) {
  const numberRegex = /^[0-9]+$/;
  if (inputElement.value && !numberRegex.test(inputElement.value)) {
    showError(inputElement, "This field can only contain numbers");
  } else {
    clearError(inputElement);
  }
}

export function checkEmpty(input) {
  if (input.required && input.value.trim() === "") {
    showError(input, "This field cannot be blank");
  } else {
    clearError(input);
  }
}
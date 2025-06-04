<?php
session_start();
if (empty($_SESSION['token'])) {
  $_SESSION['token'] = bin2hex(random_bytes(32));
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP Test</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="content">
    <div class="banner-image">
      <img src="./public/expat_logo_2.jpg" alt="Banner Image" />
    </div>

    <div class="container">
      <div class="image-section"></div>
      <div class="form-section">
        <form id="regForm">
          <label for="accountType">Account Type:</label>
          <select id="accountType" name="AccountType" required>
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
          </select>

          <div id="accountInfo">
            <label for="username">Username:</label>
            <input type="text" name="Username" id="username" minlength="3" maxlength="20" required />

            <label for="password">Password:</label>
            <input type="password" name="Password" id="password" required />

            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" name="ConfirmPassword" id="confirmPassword" required />

            <ul id="passwordRequirements">
              <li id="minLength">Minimum 8 characters</li>
              <li id="uppercase">At least one uppercase letter</li>
              <li id="lowercase">At least one lowercase letter</li>
              <li id="number">At least one number</li>
              <li id="specialChar">At least one special character</li>
            </ul>
          </div>

          <div id="personalInfo">
            <label for="fullName" id="fullNameLabel">Full Name:</label>
            <input type="text" name="FullName" id="fullName" required  maxlength="50" />

            <div id="contactTitle">
              <label for="title">Contact Title:</label>
              <input type="text" name="Title" id="title" maxlength="50"/>
            </div>
          </div>

          <div id="contactDetails">
            <label for="countryCode">Country Code:</label>
            <select id="countryCode" name="CountryCode">
              <option value="+1">+1 (USA/Canada)</option>
              <option value="+44">+44 (UK)</option>
            </select>

            <label for="phone">Phone Number:</label>
            <input type="tel" name="Phone" id="phone" maxlength="20" />

            <label for="extension">Extension (optional):</label>
            <input type="text" name="Extension" id="extension" maxlength="10"/>

            <label for="email">Email:</label>
            <input type="email" name="Email" id="email"  maxlength="50" required />
          </div>
          <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
          <button type="submit">Register</button>
        </form>
        <div id="responseMessage"></div>
      </div>
    </div>
  </div>

  <script type="module" src="script.js"></script>
</body>

</html>
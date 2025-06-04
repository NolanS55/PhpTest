<?php
class Validator {
    private $data;
    private $errors = [];

    public function __construct($postData) {
        $this->data = $postData;
    }

    public function sanitize($value) {
        return trim(strip_tags($value));
    }

    public function validateUsername($field) {
        $username = $this->sanitize($this->data[$field]);
        return $username;
    }

    public function validatePassword($field) {
        $password = $this->data[$field];
        if (
            strlen($password) < 8 ||
            !preg_match('/[A-Z]/', $password) ||
            !preg_match('/[a-z]/', $password) ||
            !preg_match('/[0-9]/', $password) ||
            !preg_match('/[@$!%*#?&]/', $password)
        ) {
            $this->errors[$field] = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        }
        $password = password_hash($password, PASSWORD_DEFAULT);
        return $password;
    }

    public function validateName($field) {
        $name = $this->sanitize($this->data[$field]);
        if (!preg_match("/^[a-zA-Z' -]+$/", $name)) {
            $this->errors[$field] = "Name can only contain letters, apostrophes, spaces, and hyphens.";
        }
        return $name;
    }

    public function validateEmail($field) {
        $email = filter_var($this->data[$field], FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = "Invalid email format.";
        }
        return $email;
    }

    public function validateNumber($field) {
        $number = $this->sanitize($this->data[$field]);
        if ($number !== '' && !preg_match('/^[0-9]+$/', $number)) {
            $this->errors[$field] = "Only numeric characters are allowed.";
        }
        return $number;
    }

    public function getErrors() {
        return $this->errors;
    }

    public function hasErrors() {
        return !empty($this->errors);
    }
}
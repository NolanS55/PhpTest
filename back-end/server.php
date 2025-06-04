<?php
header("Access-Control-Allow-Origin: http://localhost:8000/");
header("Content-Type: application/json");

require_once 'db.php';
require_once 'validation.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['token']) || $_POST['token'] !== $_SESSION['token']) {
        http_response_code(403);
        die(json_encode(["message" => "Your CSRF token is not valid", "success" => false]));
    } else {

        $validator = new Validator($_POST);
        $accountType = $validator->sanitize($_POST['AccountType']);

        $username = $validator->validateUsername('Username');
        $password = $validator->validatePassword('Password');
        $fullName = $validator->validateName('FullName');
        $email = $validator->validateEmail('Email');

        $title = isset($_POST['Title']) ? $validator->sanitize($_POST['Title']) : null;
        $countryCode = isset($_POST['CountryCode']) ? $validator->sanitize($_POST['CountryCode']) : null;
        $phone = isset($_POST['Phone']) ? $validator->validateNumber('Phone') : null;
        $extension = isset($_POST['Extension']) ? $validator->validateNumber('Extension') : null;

        if ($validator->hasErrors()) {
            echo json_encode(['message' => 'Validation failed', 'errors' => $validator->getErrors(), 'success' => false, ]);
            exit;
        }
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $db = new Database();
        $pdo = $db->connect();

        try {
            $pdo->beginTransaction();

            $query = $pdo->prepare("SELECT account_id FROM account_types WHERE account_type = :account_type");
            $query->execute([':account_type' => $accountType]);
            $accountTypeRow = $query->fetch(PDO::FETCH_ASSOC);
            if (!$accountTypeRow) {
                throw new Exception("Invalid account type");
            }
            $account_id = $accountTypeRow['account_id'];

            $query = $pdo->prepare("INSERT INTO users (account_id, username, password_hash, full_name, email) 
                           VALUES (:account_id, :username, :password_hash, :full_name, :email)");
            $query->execute([
                ':account_id' => $account_id,
                ':username' => $username,
                ':password_hash' => $hashedPassword,
                ':full_name' => $fullName,
                ':email' => $email
            ]);
            $user_id = $pdo->lastInsertId();

            if ($title !== null) {
                $query = $pdo->prepare("INSERT INTO user_titles (user_id, title) VALUES (:user_id, :title)");
                $query->execute([
                    ':user_id' => $user_id,
                    ':title' => $title
                ]);
            }

            if ($phone !== null) {
                $query = $pdo->prepare("INSERT INTO user_phones (user_id, country_code, phone, extension) 
                               VALUES (:user_id, :country_code, :phone, :extension)");
                $query->execute([
                    ':user_id' => $user_id,
                    ':country_code' => $countryCode,
                    ':phone' => $phone,
                    ':extension' => $extension
                ]);
            }

            $pdo->commit();

            echo json_encode(['message' => 'User registered', 'success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();

            if ($e instanceof PDOException && $e->errorInfo[1] == 1062) {
                echo json_encode(['message' => 'An account already exists with those credentials', 'success' => false]);
            } else {
                echo json_encode(['message' => 'Failed to register user', 'success' => false]);
            }
        }
    }
}

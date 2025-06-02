<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Content-Type: application/json");

$host = 'localhost';
$db = 'user_registration';
$user = 'phpTestUser';
$pass = 'SecureUser1';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
  http_response_code(500);
  echo json_encode(['message' => 'DB connection failed']);
  exit;
}

function sanitize($value) {
  return htmlspecialchars(strip_tags($value));
}

$accountType = sanitize($_POST['AccountType']);
$username = sanitize($_POST['Username']);
$password = $_POST['Password'];
$fullName = sanitize($_POST['FullName']);
$title = isset($_POST['Title']) ? sanitize($_POST['Title']) : null;
$phone = isset($_POST['Phone']) ? sanitize($_POST['Phone']) : null;
$email = filter_var($_POST['Email'], FILTER_SANITIZE_EMAIL);

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
  $query = $pdo->prepare("INSERT INTO users 
    (account_type, username, password_hash, full_name, title, phone, email) 
    VALUES (:account_type, :username, :password_hash, :full_name, :title, :phone, :email)");

  $query->execute([
    ':account_type' => $accountType,
    ':username' => $username,
    ':password_hash' => $hashedPassword,
    ':full_name' => $fullName,
    ':title' => $title,
    ':phone' => $phone,
    ':email' => $email
  ]);

  echo json_encode(['message' => 'User registered', "success" => true]);
} catch (PDOException $e) {
  if ($e->errorInfo[1] == 1062) {
    echo json_encode(['message' => 'Username or Email already exists', "success" => false]);
  } else {
    echo json_encode(['message' => 'Failed to register user', "success" => true]);
  }
}
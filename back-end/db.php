<?php
function loadEnv($path)
{
    if (!file_exists($path)) {
        throw new Exception(".env file not found: $path");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if (!getenv($name)) {
            putenv("$name=$value");
        }
    }
}
loadEnv(__DIR__ . '/.env');
class Database {
    private $host;
    private $db;
    private $user;
    private $pass;
    private $charset;
    private $pdo = null;

    public function __construct() {
        $this->host = getenv('DB_HOST');
        $this->db = getenv('DB_NAME');
        $this->user = getenv('DB_USER');
        $this->pass = getenv('DB_PASS');
        $this->charset = getenv('DB_CHARSET');
    }

    public function connect() {
        if ($this->pdo !== null) {
            return $this->pdo;
        }

        $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        try {
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);
            return $this->pdo;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database connection failed ' + ': ' . $e->getMessage(), 'success' => false]);
            exit;
        }
    }
}
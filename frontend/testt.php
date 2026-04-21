<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "test_db";

try {
    $conn = new PDO(
        "mysql:host=$servername;dbname=$database;charset=utf8",
        $username,
        $password
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully (PDO)";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
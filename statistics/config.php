<?php
	$servername = "appserver.alunos.di.fc.ul.pt";
    //$servername = "localhost";
    $username = "aw002";
    $password = "aw002";
    $dbname = "aw002";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>
<!DOCTYPE html>
<html>
<head>
    <link rel="shortcut icon" href="css/favicon.ico" type="image/x-icon"/>
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="css/styles.css">
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
</head>
<body class="padding-2">
<?php
require_once 'templates/form/form.php';
if ($_GET['medical-specialty']) {
    require_once 'templates/results/results.php';
}
?>
</body>
<script type="text/javascript">
</script>
</html>
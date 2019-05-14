<?php

include "config.php";

$tfidfPer=mysqli_real_escape_string($conn, $_REQUEST['tfidfPer']);
$pubDatePer=mysqli_real_escape_string($conn, $_REQUEST['pubDatePer']);
$similarityPer=mysqli_real_escape_string($conn, $_REQUEST['similarityPer']);
$explicitFeedbackPer=mysqli_real_escape_string($conn, $_REQUEST['explicitFeedbackPer']);
$implicitFeedbackPer=mysqli_real_escape_string($conn, $_REQUEST['implicitFeedbackPer']);


$id=mysqli_real_escape_string($conn, $_REQUEST['id']);



$id=$_REQUEST['id'];



if ($id){
$sql="update weighted_average_percentages set 
	tfidfPer='$tfidfPer', 
	pubDatePer='$pubDatePer',
	similarityPer='$similarityPer',
	explicitFeedbackPer='$explicitFeedbackPer',
	implicitFeedbackPer='$implicitFeedbackPer'
	where id=$id";
}
	
$return=@mysqli_query($conn, $sql);

if ($return){
	print "Update saved<br>";
	include "update_percentages.php";
} else {
	print "Error occurred" . mysqli_error($conn) ."<br>";
	include "update_percentages.php";
} 	
?>
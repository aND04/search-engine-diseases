<?php
include "config.php";

$id=@$_REQUEST['id = 1'];

if ($id = 1){
	$sql="select * from weighted_average_percentages where id='$id'";

	$result=mysqli_query($conn, $sql);

	$row = mysqli_fetch_array($result);
}

//print $id?"Editar registo ". @$row['id']:"Registo Novo"; 

?>

<html>
	<head>
		<meta charset="utf-8">
		<title>Weighted Average Percentages</title>
	</head>
	<body>
		<h1> Weighted Average Percentages </h1>
		<form action="save_percentages.php" method="POST">
			<p style="text-align: justify">
				TfidfPer - <input type="text" name="tfidfPer" size="50" value="<?php print @$row['tfidfPer']?>">
			</p>
			<p style="text-align: justify">
				PubDatePer - <input type="text" name="pubDatePer" size="50" value="<?php print @$row['pubDatePer']?>">
			</p>
			<p style="text-align: justify">
				SimilarityPer - <input type="text" name="similarityPer" size="50" value="<?php print @$row['similarityPer']?>">
			</p>
			<p style="text-align: justify">
				ExplicitFeedBackPer - <input type="text" name="explicitFeedbackPer" size="50" value="<?php print @$row['explicitFeedbackPer']?>">
			</p>
			<p style="text-align: justify">
				ImplicitFeedBackPer - <input type="text" name="implicitFeedbackPer" size="50" value="<?php print @$row['implicitFeedbackPer']?>">
			</p>
			<input name="id" type="hidden" value="<?php echo $id?>">
					
			<p>
				<input type="submit" VALUE="Save"/>
			</p>
		</form>
	</body>
</html>
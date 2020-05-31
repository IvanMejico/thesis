<?php
	session_start();
	include('home/config.php');
	$msg = "";
	if(isset($_POST['username']) && isset($_POST['password'])) {
		$conn = mysqli_connect($servername, $username, $password, $db);

		$username = $_POST['username'];
		$password = $_POST['password'];
		$sql = "SELECT * FROM `user_accounts` WHERE `username` = '$username' AND `password` = '$password';";

		if($result = mysqli_query($conn, $sql)) {
			$count = $result->num_rows;
			if($count > 0) {
				$row = $result->fetch_assoc();
				$_SESSION['logged_in_user'] = $row['username'];
				header('Location: home/');
			} else {
				$msg = '<span class="form-message">Incorrect username or password</span>';
			}
		} else {
			echo 'ERROR: '. mysqli_error($conn);
		}
	}

	if(isset($_SESSION['logged_in_user'])) {
		header('Location: home/');
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="shortcut icon" type="image/x-icon" href="home/assets/logo.png">
	<title>Wind-Solar Hybrid Monitoring System Dashboard</title>
	<link rel="stylesheet" href="assets/css/login.css">
	<style>
		.form-message {
			background-color: #f21c1c;
			color: #fff;
			font-size: 0.9em;
			text-align: center;
			padding: 5px 10px;
			margin-bottom: 40px;
			border-radius: 5px;
			display: block;
    	}
	</style>
</head>
<body>
<div class="login-page">
	<div class="login">
		<div class="form-container">
			<div class="form-wrapper">
				<form method="POST">
					<div>login</div>
					<?=$msg?>
					<input required type="username" id="username" name="username" />
					<label for="username">username</label>

					<input required id="password" name="password" type="password" />
					<label for="password">password</label>

					<button>login</button>

					<p><a href="settings.php">Change username and password</a></p>
				</form>
			</div>

		</div>
	</div>
	<div class="photo">
	</div>
</div>
</body>
</html>
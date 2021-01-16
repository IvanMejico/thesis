<?php
$msg = '';

include('requests/includes/config.php');
if(isset($_POST['new-username']) && isset($_POST['new-password'])) {
    // No password hashing yet
    $conn = mysqli_connect($servername, $username, $password, $db);

    $current_uname = $_POST['current-username'];
    $current_pwd = $_POST['current-password'];
    $new_uname = $_POST['new-username'];
    $new_pwd = $_POST['new-password'];
    
    $sql = "SELECT * FROM `user_accounts` WHERE `username` = '$current_uname' AND `password` = '$current_pwd';";
    if($result = mysqli_query($conn, $sql)) {
        $count = $result->num_rows;
        if($count > 0) {
            // save new username and password
            $sql = "UPDATE `user_accounts` SET `username` = '$new_uname', " 
                . "`password` = '$new_pwd' WHERE `username` = '$current_uname' "
                . "AND `password` = '$current_pwd';";
            if(mysqli_query($conn, $sql))
                header('Location: index.php');
            else
                echo 'ERROR: '. mysqli_error($conn);

        } else {
            $msg = '<div class="form-message"><span>Incorrect username or password! Please try again.</span></div>';
        }
    } else {
        echo 'ERROR: '. mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Wind-Solar Hybrid Monitoring System Dashboard - Change Username and Password</title>
<link rel="shortcut icon" type="image/x-icon" href="datapoints/assets/logo.png">
<style>
    * {
        padding: 0px;
        margin: 0px;
        box-sizing: border-box;
    }
    body {
        background-color: #ccc;
        
    }
    table {
        margin: 0 auto;
    }
    .main-content {
        
        width: 400px;
        height: 250px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    .container {
        padding: 20px 25px;
        background-color: #fff;
        border-radius: 5px;
    }
    tr td:first-child {
        padding-right: 30px;
    }
    td {
        margin-bottom: 10px;
    }

    td input {
        border: 1px solid #b59e9e;
        border-radius: 4px;
        padding: 5px 6px;
    }

    td input[type~="submit"]{
        color: #fff;
        font-size: 1.1em;
        background-color: #3c2a6d;
        cursor: pointer;
        width: 100%;
    }

    td input[type~="submit"]:hover {
        filter: brightness(120%)
    }

    td input[type~="submit"]:active {
        opacity: 80%;
    }

    tr:last-child td {
        padding: 20px 0 0 0;
    }

    input {
        content: '';
    }
    .form-message {
        background-color: #e72638;
        color: #fff;
        font-size: 0.9em;
        text-align: center;
        padding: 5px 10px;
        margin-bottom: 10px;
    }
</style>
</head>
<body>
    <div class="main-content">
        <div class = "container">
            <?=$msg?>
            <form method="post">
                <table>
                    <tr>
                        <td>
                            <label for="current-username">Current Username</label>
                        </td>
                        <td>
                            <input type="text" id="current-username" name="current-username" autocomplete="off" placeholder="input current username" required>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                            <label for="current-password">Current Password</label>
                        </td>
                        <td>
                            <input type="password" id="current-password" name="current-password" autocomplete="off" placeholder="input current password" required>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="new-username">New Username</label>
                        </td>
                        <td>
                            <input type="text" id="new-username" name="new-username" autocomplete="off" placeholder="input new username" required>
                        </td>
                    </tr>
    
    
                    <tr>
                        <td>
                            <label for="new-password">New Password</label>
                        </td>
                        <td>
                            <input type="password" id="new-password" name="new-password" autocomplete="off" placeholder="input new password" required>
                        </td>
                    </tr>
                    <tr >
                        <td colspan=2>
                            <input type="submit" value="Submit">
                        </td>
                    </tr>
                </table>
                
            </form>
        </div>
    </div>
</body>
</html>



<script>
</script>
<!DOCTYPE html>
<html lang="en">
 
<head>
 
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">
</head>
<title>Temperature Result</title>
<body>
 
<div id="show">
 
</div>
 
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        setInterval(function () {
            $('#show').load('displaydata.php')
        }, 3000);
    });
</script>
 
<!------Jquery------------------>
 
</body>
</html>

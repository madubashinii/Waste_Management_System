<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Submitted</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light text-center p-5">
    <div class="alert alert-success mt-5">
        <h4><%= request.getAttribute("message") %></h4>
        <p>You’ll receive confirmation once the admin verifies your payment.</p>
        <a href="userDashboard.jsp" class="btn btn-success mt-3">Go to Dashboard</a>
    </div>
</body>
</html>

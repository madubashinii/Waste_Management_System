<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Dashboard | Waste Management</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f4f6f9;
            font-family: 'Segoe UI', sans-serif;
        }
        .dashboard-container {
            max-width: 1000px;
            margin: 40px auto;
        }
        .profile-card {
            background: white;
            border-radius: 12px;
            padding: 20px 30px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .profile-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-right: 20px;
            color: #495057;
        }
        .profile-details h5 {
            margin: 0;
            font-weight: 600;
        }
        .profile-details small {
            color: #6c757d;
        }
        .icon-buttons {
            margin-left: auto;
        }
        .icon-buttons i {
            font-size: 22px;
            margin-left: 18px;
            color: #198754;
            cursor: pointer;
        }
        .icon-buttons i:hover {
            color: #145c32;
        }
        .bin-section {
            background: white;
            margin-top: 25px;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .bin-card {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            background: #e9f7ef;
        }
        .bin-card h6 {
            font-weight: 600;
        }
    </style>
</head>
<body>

<div class="dashboard-container">
    <!-- Profile Section -->
    <div class="profile-card">
        <div class="profile-avatar">
            <i class="fa-solid fa-user"></i>
        </div>
        <div class="profile-details">
            <h5><%= request.getAttribute("userName") != null ? request.getAttribute("userName") : "User" %></h5>
        </div>
        <div class="icon-buttons">
            <i class="fa-solid fa-trash-can"></i>
            <i class="fa-solid fa-envelope"></i>
        </div>
    </div>

    <!-- Bin Details Section -->
    <div class="bin-section">
        <h5 class="mb-4">Your Bin Details</h5>
        <div class="row g-3">
            <div class="col-md-4">
                <div class="bin-card">
                    <i class="fa-solid fa-recycle fa-2x mb-2 text-success"></i>
                    <h6>Plastic Bin</h6>
                    <p><%= request.getAttribute("plasticCount") != null ? request.getAttribute("plasticCount") : "12" %> items</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bin-card">
                    <i class="fa-solid fa-apple-whole fa-2x mb-2 text-warning"></i>
                    <h6>Organic Bin</h6>
                    <p><%= request.getAttribute("organicCount") != null ? request.getAttribute("organicCount") : "8" %> items</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bin-card">
                    <i class="fa-solid fa-box fa-2x mb-2 text-primary"></i>
                    <h6>General Waste</h6>
                    <p><%= request.getAttribute("generalCount") != null ? request.getAttribute("generalCount") : "5" %> items</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>

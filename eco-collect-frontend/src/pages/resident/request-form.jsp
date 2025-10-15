<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Request Pickup | Waste Management</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f4f6f9;
            font-family: 'Segoe UI', sans-serif;
        }
        .form-container {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h4 {
            font-weight: 600;
            color: #198754;
        }
        .item-row {
            align-items: center;
        }
        .total-display {
            font-size: 1.3rem;
            font-weight: 600;
            color: #145c32;
        }
        .btn-success {
            padding: 10px 25px;
            font-weight: 600;
        }
    </style>

    <script>
        // Price per kg (you can also load from database)
        const prices = {
            "Plastic": 20,
            "Metal": 50,
            "Paper": 15,
            "Glass": 25,
            "E-waste": 70
        };

        function updatePrice(row) {
            const itemType = row.querySelector(".item-type").value;
            const qtyInput = row.querySelector(".qty");
            const priceDisplay = row.querySelector(".price");
            const totalDisplay = row.querySelector(".total");

            const price = prices[itemType] || 0;
            const qty = parseFloat(qtyInput.value) || 0;
            const total = price * qty;

            priceDisplay.value = price.toFixed(2);
            totalDisplay.value = total.toFixed(2);

            calculateGrandTotal();
        }

        function calculateGrandTotal() {
            let total = 0;
            document.querySelectorAll(".total").forEach(el => {
                total += parseFloat(el.value) || 0;
            });
            document.getElementById("grandTotal").textContent = total.toFixed(2);
        }

        function addRow() {
            const container = document.getElementById("itemContainer");
            const newRow = document.querySelector(".item-row").cloneNode(true);
            newRow.querySelectorAll("input").forEach(i => i.value = "");
            newRow.querySelector(".item-type").selectedIndex = 0;
            container.appendChild(newRow);
        }
    </script>
</head>
<body>

<div class="form-container">
    <h4 class="mb-4"><i class="fa-solid fa-truck"></i> Request Pickup</h4>

    <form action="RequestPickupServlet" method="post">
        <!-- User Info -->
        <div class="mb-3">
            <label for="userName" class="form-label">Name</label>
            <input type="text" id="userName" name="userName" class="form-control" value="<%= request.getAttribute("userName") != null ? request.getAttribute("userName") : "" %>" required>
        </div>

        <div class="mb-3">
            <label for="address" class="form-label">Pickup Address</label>
            <input type="text" id="address" name="address" class="form-control" placeholder="Enter your pickup address" required>
        </div>

        <hr>

        <!-- Item Table -->
        <div id="itemContainer">
            <div class="row g-3 mb-3 item-row">
                <div class="col-md-3">
                    <label class="form-label">Item Type</label>
                    <select class="form-select item-type" name="itemType[]" onchange="updatePrice(this.parentElement.parentElement)" required>
                        <option value="">Select</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Metal">Metal</option>
                        <option value="Paper">Paper</option>
                        <option value="Glass">Glass</option>
                        <option value="E-waste">E-waste</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Quantity (kg)</label>
                    <input type="number" step="0.1" min="0" class="form-control qty" name="quantity[]" oninput="updatePrice(this.parentElement.parentElement)" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Price/kg (Rs)</label>
                    <input type="text" class="form-control price" name="price[]" readonly>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Total (Rs)</label>
                    <input type="text" class="form-control total" name="itemTotal[]" readonly>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button type="button" class="btn btn-outline-success" onclick="addRow()"><i class="fa-solid fa-plus"></i> Add</button>
                </div>
            </div>
        </div>

        <hr>

        <!-- Total Display -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fs-5 fw-semibold">Grand Total:</span>
            <span id="grandTotal" class="total-display">0.00</span>
        </div>

        <!-- Submit -->
        <div class="text-end">
            <button type="submit" class="btn btn-success"><i class="fa-solid fa-paper-plane"></i> Submit Request</button>
        </div>
    </form>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

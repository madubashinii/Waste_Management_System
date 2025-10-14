<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice | Waste Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f4f6f9; font-family: 'Segoe UI', sans-serif; }
        .invoice-container {
            max-width: 800px;
            margin: 40px auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
<div class="invoice-container">
    <h4 class="text-success mb-4">Invoice</h4>

    <p><strong>Invoice ID:</strong> <%= request.getAttribute("invoiceId") %></p>
    <p><strong>Name:</strong> <%= request.getAttribute("userName") %></p>
    <p><strong>Address:</strong> <%= request.getAttribute("address") %></p>

    <hr>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Item Type</th>
                <th>Quantity (kg)</th>
                <th>Total (Rs)</th>
            </tr>
        </thead>
        <tbody>
        <%
            String[] types = (String[]) request.getAttribute("itemTypes");
            String[] qtys = (String[]) request.getAttribute("quantities");
            String[] totals = (String[]) request.getAttribute("totals");
            if (types != null) {
                for (int i = 0; i < types.length; i++) {
        %>
        <tr>
            <td><%= types[i] %></td>
            <td><%= qtys[i] %></td>
            <td>Rs. <%= totals[i] %></td>
        </tr>
        <% }} %>
        </tbody>
    </table>

    <div class="text-end fs-5 fw-semibold text-success">
        Grand Total: Rs. <%= request.getAttribute("grandTotal") %>
    </div>

    <hr>

    <h5 class="mt-4">Upload Payment Slip</h5>
    <form action="UploadSlipServlet" method="post" enctype="multipart/form-data">
        <input type="hidden" name="invoiceId" value="<%= request.getAttribute("invoiceId") %>">
        <div class="mb-3">
            <input type="file" name="slipFile" class="form-control" accept="image/*,.pdf" required>
        </div>
        <button type="submit" class="btn btn-success">Upload Slip</button>
    </form>
    <div class="mt-3">
    <a href="DownloadInvoiceServlet?invoiceId=<%= request.getAttribute("invoiceId") %>"
       class="btn btn-outline-success">
        <i class="fa-solid fa-file-pdf"></i> Download Invoice PDF
    </a>
</div>

</div>
</body>
</html>

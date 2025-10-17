package com.csse.ecocollectbackend.resident.controller;

import com.csse.ecocollectbackend.resident.entity.DBUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;

@WebServlet("/saveBilling")
public class SaveBillingServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("residentName");
        double amount = Double.parseDouble(request.getParameter("amount"));
        String status = request.getParameter("status");

        try (Connection con = DBUtil.getConnection()) {
            String sql = "INSERT INTO billing (resident_name, amount, status) VALUES (?, ?, ?)";
            try (var stmt = con.prepareStatement(sql)) {
                stmt.setString(1, name);
                stmt.setDouble(2, amount);
                stmt.setString(3, status);
                stmt.executeUpdate();
            }
            response.getWriter().println("Billing record inserted!");
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().println("Error saving billing: " + e.getMessage());
        }
    }
}

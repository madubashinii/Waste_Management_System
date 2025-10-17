package com.csse.ecocollectbackend.resident.controller;

import java.io.IOException;


import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@WebServlet("/resident.controller.RequestPickupServlet")
@MultipartConfig
public class RequestPickupServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String userName = request.getParameter("userName");
        String address = request.getParameter("address");
        String[] itemTypes = request.getParameterValues("itemType[]");
        String[] quantities = request.getParameterValues("quantity[]");
        String[] prices = request.getParameterValues("price[]");
        String[] totals = request.getParameterValues("itemTotal[]");

        double grandTotal = 0;
        for (String t : totals) {
            grandTotal += Double.parseDouble(t);
        }

        // Example: create invoice ID
        String invoiceId = "INV" + System.currentTimeMillis();


        // yourDatabase.savePickup(userName, address, grandTotal, invoiceId, etc...);

        // Send data to invoice.jsp
        request.setAttribute("invoiceId", invoiceId);
        request.setAttribute("userName", userName);
        request.setAttribute("address", address);
        request.setAttribute("grandTotal", grandTotal);
        request.setAttribute("itemTypes", itemTypes);
        request.setAttribute("quantities", quantities);
        request.setAttribute("totals", totals);

        request.getRequestDispatcher("invoice.jsp").forward(request, response);
    }
}

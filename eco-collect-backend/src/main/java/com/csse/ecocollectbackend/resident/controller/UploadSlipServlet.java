package com.csse.ecocollectbackend.resident.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import java.io.IOException;
import jakarta.servlet.annotation.MultipartConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet("/resident.controller.UploadSlipServlet")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
        maxFileSize = 1024 * 1024 * 10,              // 10MB
        maxRequestSize = 1024 * 1024 * 50)           // 50MB
public class UploadSlipServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String invoiceId = request.getParameter("invoiceId");

        Part filePart = request.getPart("slipFile");
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();

        String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) uploadDir.mkdir();

        String filePath = uploadPath + File.separator + invoiceId + "_" + fileName;
        filePart.write(filePath);

        // Update your DB here: mark payment status = "Pending Verification"
        // yourDatabase.saveSlip(invoiceId, filePath, "Pending Verification");

        request.setAttribute("message", "Slip uploaded successfully! Your payment is pending verification.");
        request.getRequestDispatcher("success.jsp").forward(request, response);
    }
}

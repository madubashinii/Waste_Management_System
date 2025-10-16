package com.csse.ecocollectbackend.resident.controller;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.io.OutputStream;


@WebServlet("/resident.controller.DownloadInvoiceServlet")
public class DownloadInvoiceServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Example data (in real app, load from DB or session)
        String invoiceId = request.getParameter("invoiceId");
        String userName = "Sasanka Thilakaratne";
        String address = "123 Green Street, Colombo";
        String[] itemTypes = {"Plastic", "Metal", "Paper"};
        String[] quantities = {"5", "2", "4"};
        String[] totals = {"100", "200", "60"};
        double grandTotal = 360;

        // Set response for PDF
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=" + invoiceId + ".pdf");

        try {
            Document document = new Document(PageSize.A4);
            OutputStream out = response.getOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(34, 139, 34));
            Paragraph title = new Paragraph("Waste Management Invoice\n\n", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // User Info
            document.add(new Paragraph("Invoice ID: " + invoiceId));
            document.add(new Paragraph("Customer Name: " + userName));
            document.add(new Paragraph("Address: " + address));
            document.add(new Paragraph("\n"));

            // Table
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.addCell("Item Type");
            table.addCell("Quantity (kg)");
            table.addCell("Total (Rs)");

            for (int i = 0; i < itemTypes.length; i++) {
                table.addCell(itemTypes[i]);
                table.addCell(quantities[i]);
                table.addCell(totals[i]);
            }
            document.add(table);

            // Total
            document.add(new Paragraph("\nGrand Total: Rs. " + grandTotal,
                    new Font(Font.HELVETICA, 14, Font.BOLD, new Color(0, 100, 0))));

            document.add(new Paragraph("\nThank you for using our Waste Management service!",
                    new Font(Font.HELVETICA, 12, Font.ITALIC)));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

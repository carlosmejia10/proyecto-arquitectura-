package com.pagos.spring.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class VistasController {
    @GetMapping("pago/success")
    public String successPago(
            @RequestParam(value = "payment_id", required = false) String paymentId,
            @RequestParam(value = "collection_id", required = false) String collectionId,
            @RequestParam(value = "merchant_order_id", required = false) String merchantOrderId,
            @RequestParam(value = "preference_id", required = false) String preferenceId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "collection_status", required = false) String collectionStatus,
            @RequestParam(value = "payment_type", required = false) String paymentType,
            @RequestParam(value = "external_reference", required = false) String externalReference,
            @RequestParam(value = "transaction_amount", required = false) String transactionAmount,
            Model model) {

        model.addAttribute("paymentId", firstNonNull(paymentId, collectionId));
        model.addAttribute("merchantOrderId", merchantOrderId);
        model.addAttribute("preferenceId", preferenceId);
        model.addAttribute("status", firstNonNull(status, collectionStatus));
        model.addAttribute("paymentType", paymentType);
        model.addAttribute("externalReference", externalReference);
        model.addAttribute("transactionAmount", transactionAmount);

        return "pagosuccess_vista";
    }

    @GetMapping("pago/pending")
    public String pendingPago() {
        return "pagopending_vista";
    }

    @GetMapping("pago/failure")
    public String failurePago() {
        return "pagofailure_vista";
    }

    private String firstNonNull(String first, String second) {
        return first != null ? first : second;
    }
}

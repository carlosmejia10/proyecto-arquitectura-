package com.pagos.spring.demo.controllers;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;

import jakarta.servlet.http.HttpServletRequest;

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
            Model model,
            HttpServletRequest request) {

        String resolvedPaymentId = firstNonNull(paymentId, collectionId);

        model.addAttribute("paymentId", resolvedPaymentId);
        model.addAttribute("merchantOrderId", merchantOrderId);
        model.addAttribute("preferenceId", preferenceId);
        model.addAttribute("status", firstNonNull(status, collectionStatus));
        model.addAttribute("paymentType", paymentType);
        model.addAttribute("externalReference", externalReference);
        model.addAttribute("transactionAmount", transactionAmount);

        // Debug: guardar todos los query params que llegaron
        Map<String, String> params = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> String.join(",", e.getValue())));
        model.addAttribute("queryParams", params);

        // Si tenemos el id de pago, intentamos traer datos frescos desde Mercado Pago
        if (resolvedPaymentId != null) {
            try {
                Payment payment = new PaymentClient().get(Long.parseLong(resolvedPaymentId));
                model.addAttribute("status", payment.getStatus());
                model.addAttribute("paymentType", payment.getPaymentTypeId());
                model.addAttribute("transactionAmount", payment.getTransactionAmount());
                if (payment.getOrder() != null) {
                    model.addAttribute("merchantOrderId", payment.getOrder().getId());
                }
                model.addAttribute("externalReference", payment.getExternalReference());
            } catch (Exception e) {
                System.out.println("No se pudo cargar el detalle del pago " + resolvedPaymentId + ": " + e.getMessage());
                model.addAttribute("paymentFetchError", e.getMessage());
            }
        }

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

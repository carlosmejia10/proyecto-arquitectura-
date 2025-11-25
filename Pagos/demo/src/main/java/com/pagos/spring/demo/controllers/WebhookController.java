package com.pagos.spring.demo.controllers;

import com.mercadopago.client.merchantorder.MerchantOrderClient;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.merchantorder.MerchantOrder;
import com.mercadopago.resources.payment.Payment;
import com.pagos.spring.demo.entities.Transaccion;
import com.pagos.spring.demo.repositories.TransaccionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class WebhookController {

    private final TransaccionRepository transaccionRepository;

    public WebhookController(TransaccionRepository transaccionRepository) {
        this.transaccionRepository = transaccionRepository;
    }

    @PostMapping("/webhook/mp")
    public ResponseEntity<String> webhook(@RequestBody Map<String, Object> body) {

        System.out.println("Webhook MP payload: " + body);

        // -----------------------------
        // 1) Obtener type + id
        // -----------------------------
        String type = body.get("type") != null ? body.get("type").toString() : null;
        String idStr = null;

        Object dataObj = body.get("data");
        if (dataObj instanceof Map<?, ?> dataMap) {
            Object idObj = dataMap.get("id");
            if (idObj != null) {
                idStr = idObj.toString();
            }
        }

        // Soportar formato viejo: topic + resource
        if (type == null) {
            Object topicObj = body.get("topic");
            Object resourceObj = body.get("resource");

            if (topicObj != null) {
                type = topicObj.toString(); // merchant_order, payment, etc.
            }
            if (resourceObj != null) {
                String resource = resourceObj.toString(); // .../merchant_orders/35863890558
                String[] parts = resource.split("/");
                idStr = parts[parts.length - 1];
            }
        }

        if (type == null) type = "unknown";

        System.out.println("Webhook type=" + type + " id=" + idStr);

        try {

            // ==============================================
            // CASO 1: merchant_order → dejamos en PENDING
            // ==============================================
            if ("merchant_order".equals(type) && idStr != null) {

                Long merchantOrderId = Long.valueOf(idStr);

                MerchantOrderClient moClient = new MerchantOrderClient();
                MerchantOrder mo = moClient.get(merchantOrderId);

                String preferenceId = mo.getPreferenceId();
                System.out.println("MerchantOrder preferenceId=" + preferenceId);

                String nuevoEstado = "PENDING";

                if (mo.getPayments() != null && !mo.getPayments().isEmpty()) {

                    boolean anyApproved = mo.getPayments().stream()
                            .anyMatch(p -> "approved".equalsIgnoreCase(p.getStatus()));

                    boolean allRejected = mo.getPayments().stream()
                            .allMatch(p -> "rejected".equalsIgnoreCase(p.getStatus()));

                    if (anyApproved) {
                        nuevoEstado = "APPROVED";
                    } else if (allRejected) {
                        nuevoEstado = "REJECTED";
                    }
                }

                String finalEstado = nuevoEstado;

                transaccionRepository.findByPreferenceId(preferenceId)
                        .ifPresent(tx -> {
                            tx.setEstado(finalEstado);
                            transaccionRepository.save(tx);
                            System.out.println("Transacción " + tx.getId()
                                    + " actualizada a estado = " + finalEstado
                                    + " (merchant_order)");
                        });
            }

            // ==============================================
            // CASO 2: payment → actualizamos según status
            // ==============================================
            if ("payment".equals(type) && idStr != null) {

                Long paymentId = Long.valueOf(idStr);

                PaymentClient paymentClient = new PaymentClient();
                Payment payment = paymentClient.get(paymentId);

                String status = payment.getStatus();      // approved, rejected, pending...
                System.out.println("Payment " + paymentId + " status=" + status);

                // Obtenemos el merchant_order desde el pago
                Long merchantOrderId = payment.getOrder() != null
                        ? payment.getOrder().getId()
                        : null;

                String preferenceId = null;

                if (merchantOrderId != null) {
                    MerchantOrderClient moClient = new MerchantOrderClient();
                    MerchantOrder mo = moClient.get(merchantOrderId);
                    preferenceId = mo.getPreferenceId();
                    System.out.println("Payment " + paymentId +
                            " pertenece a MerchantOrder " + merchantOrderId +
                            " preferenceId=" + preferenceId);
                }

                // Si no logramos sacar preferenceId, no podemos mapear a tu tabla
                if (preferenceId != null) {

                    String nuevoEstado;
                    if ("approved".equalsIgnoreCase(status)) {
                        nuevoEstado = "APPROVED";
                    } else if ("rejected".equalsIgnoreCase(status)) {
                        nuevoEstado = "REJECTED";
                    } else {
                        nuevoEstado = "PENDING";
                    }

                    String finalEstado = nuevoEstado;

                    transaccionRepository.findByPreferenceId(preferenceId)
                            .ifPresent(tx -> {
                                tx.setEstado(finalEstado);
                                transaccionRepository.save(tx);
                                System.out.println("Transacción " + tx.getId()
                                        + " actualizada a estado = " + finalEstado
                                        + " (payment)");
                            });
                } else {
                    System.out.println("No se pudo determinar preferenceId para payment " + paymentId);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("ok");
    }
}

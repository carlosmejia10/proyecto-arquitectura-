package com.pagos.spring.demo.controllers;

import com.mercadopago.client.merchantorder.MerchantOrderClient;
import com.mercadopago.resources.merchantorder.MerchantOrder;
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

        String type = body.get("type") != null ? body.get("type").toString() : "unknown";
        Object dataObj = body.get("data");
        String idStr = null;

        if (dataObj instanceof Map<?, ?> dataMap) {
            Object idObj = dataMap.get("id");
            if (idObj != null) {
                idStr = idObj.toString();
            }
        }

        System.out.println("Webhook type=" + type + " id=" + idStr);

        try {

            // Interesa cuando Mercado Pago envía merchant_order
            if ("merchant_order".equals(type) && idStr != null) {

                Long merchantOrderId = Long.valueOf(idStr);

                MerchantOrderClient moClient = new MerchantOrderClient();
                MerchantOrder mo = moClient.get(merchantOrderId);

                String preferenceId = mo.getPreferenceId();
                System.out.println("MerchantOrder preferenceId=" + preferenceId);

                // -------------------------------
                // Determinar estado general
                // -------------------------------
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

                // Para usarlo dentro de la lambda
                String finalEstado = nuevoEstado;

                // ---------------------------------------------------------
                // Actualizar transacción en BD usando el preferenceId
                // ---------------------------------------------------------
                transaccionRepository.findByPreferenceId(preferenceId)
                        .ifPresent(tx -> {
                            tx.setEstado(finalEstado);
                            transaccionRepository.save(tx);
                            System.out.println("Transacción " + tx.getId() +
                                    " actualizada a estado = " + finalEstado);
                        });
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("ok");
    }
}

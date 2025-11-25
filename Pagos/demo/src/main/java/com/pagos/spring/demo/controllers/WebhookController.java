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

        // 1) Intentar leer el formato nuevo: type + data.id
        String type = body.get("type") != null ? body.get("type").toString() : null;
        String idStr = null;

        Object dataObj = body.get("data");
        if (dataObj instanceof Map<?, ?> dataMap) {
            Object idObj = dataMap.get("id");
            if (idObj != null) {
                idStr = idObj.toString();
            }
        }

        // 2) Si no hay type, revisar formato viejo: topic + resource
        if (type == null) {
            Object topicObj = body.get("topic");
            Object resourceObj = body.get("resource");

            if (topicObj != null) {
                type = topicObj.toString(); // merchant_order, payment, etc.
            }
            if (resourceObj != null) {
                // Ej: https://api.mercadolibre.com/merchant_orders/35863890558
                String resource = resourceObj.toString();
                String[] parts = resource.split("/");
                idStr = parts[parts.length - 1];
            }
        }

        if (type == null) {
            type = "unknown";
        }

        System.out.println("Webhook type=" + type + " id=" + idStr);

        try {
            // Solo nos interesa merchant_order para actualizar transacciones por preferenceId
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

                String finalEstado = nuevoEstado;

                // Actualizar transacción en BD usando preferenceId
                transaccionRepository.findByPreferenceId(preferenceId)
                        .ifPresent(tx -> {
                            tx.setEstado(finalEstado);
                            transaccionRepository.save(tx);
                            System.out.println("Transacción " + tx.getId()
                                    + " actualizada a estado = " + finalEstado);
                        });
            }

            // Si type = payment, de momento solo lo logueamos
            if ("payment".equals(type)) {
                System.out.println("Notificación de pago individual (payment id=" + idStr + ")");
                // Si más adelante quieres consultar PaymentClient, lo hacemos,
                // pero primero dejemos estable merchant_order + preferenceId.
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        // Siempre responde 200 rápido para que MP no reintente
        return ResponseEntity.ok("ok");
    }
}

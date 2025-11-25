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

        // ------------------------------------------------
        // 1) Normalizar: type + id (soportar formato viejo)
        // ------------------------------------------------
        String type = body.get("type") != null ? body.get("type").toString() : null;
        String idStr = null;

        Object dataObj = body.get("data");
        if (dataObj instanceof Map<?, ?> dataMap) {
            Object idObj = dataMap.get("id");
            if (idObj != null) {
                idStr = idObj.toString();
            }
        }

        // Formato viejo: topic + resource
        if (type == null) {
            Object topicObj = body.get("topic");
            Object resourceObj = body.get("resource");

            if (topicObj != null) {
                type = topicObj.toString(); // merchant_order, payment, etc.
            }
            if (resourceObj != null) {
                String resource = resourceObj.toString(); // .../merchant_orders/3586...
                String[] parts = resource.split("/");
                idStr = parts[parts.length - 1];
            }
        }

        if (type == null) {
            type = "unknown";
        }

        System.out.println("Webhook type=" + type + " id=" + idStr);

        try {
            // ==========================================================
            // CASO 1: merchant_order → calculamos estado por sus pagos
            // ==========================================================
            if ("merchant_order".equals(type) && idStr != null) {

                Long merchantOrderId = Long.valueOf(idStr);

                MerchantOrderClient moClient = new MerchantOrderClient();
                MerchantOrder mo = moClient.get(merchantOrderId);

                String preferenceId = mo.getPreferenceId();
                System.out.println("MerchantOrder preferenceId=" + preferenceId);

                String nuevoEstado = calcularEstadoPorMerchantOrder(mo);

                if (preferenceId != null) {
                    actualizarTransaccion(preferenceId, nuevoEstado, "merchant_order");
                } else {
                    System.out.println("MerchantOrder " + merchantOrderId
                            + " sin preferenceId, no se puede mapear a Transaccion.");
                }
            }

            // ==========================================================
            // CASO 2: payment → usamos payment SOLO para llegar al MO
            // ==========================================================
            if ("payment".equals(type) && idStr != null) {

                Long paymentId = Long.valueOf(idStr);

                // Pequeño delay para dar tiempo a que el pago exista en la API
                try {
                    Thread.sleep(1200);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }

                PaymentClient paymentClient = new PaymentClient();
                Payment payment;

                try {
                    payment = paymentClient.get(paymentId);
                } catch (Exception ex) {
                    System.out.println("No se pudo cargar payment " + paymentId
                            + ": " + ex.getMessage());
                    // No lanzamos error al integrador, solo registramos
                    return ResponseEntity.ok("ignored");
                }

                System.out.println("Payment " + paymentId + " status=" + payment.getStatus());

                Long merchantOrderId = payment.getOrder() != null
                        ? payment.getOrder().getId()
                        : null;

                if (merchantOrderId == null) {
                    System.out.println("Payment " + paymentId
                            + " no tiene merchant_order asociado, no se actualiza Transaccion.");
                    return ResponseEntity.ok("ok");
                }

                MerchantOrderClient moClient = new MerchantOrderClient();
                MerchantOrder mo = moClient.get(merchantOrderId);

                String preferenceId = mo.getPreferenceId();
                System.out.println("Payment " + paymentId +
                        " pertenece a MerchantOrder " + merchantOrderId +
                        " preferenceId=" + preferenceId);

                if (preferenceId != null) {
                    String nuevoEstado = calcularEstadoPorMerchantOrder(mo);
                    actualizarTransaccion(preferenceId, nuevoEstado, "payment");
                } else {
                    System.out.println("No se pudo determinar preferenceId para payment " + paymentId);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("ok");
    }

    /**
     * A partir de un MerchantOrder, determina el estado general:
     * - APPROVED: si hay al menos un pago approved.
     * - REJECTED: si todos los pagos están rejected.
     * - PENDING: en cualquier otro caso (incluye sin pagos).
     */
    private String calcularEstadoPorMerchantOrder(MerchantOrder mo) {
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

        return nuevoEstado;
    }

    /**
     * Busca la Transaccion por preferenceId y actualiza su estado.
     */
    private void actualizarTransaccion(String preferenceId, String nuevoEstado, String origen) {
        transaccionRepository.findByPreferenceId(preferenceId)
                .ifPresentOrElse(tx -> {
                            tx.setEstado(nuevoEstado);
                            transaccionRepository.save(tx);
                            System.out.println("Transacción " + tx.getId()
                                    + " actualizada a estado = " + nuevoEstado
                                    + " (" + origen + ")");
                        },
                        () -> System.out.println("No se encontró Transaccion con preferenceId=" + preferenceId));
    }
}

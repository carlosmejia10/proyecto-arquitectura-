package com.pagos.spring.demo.controllers;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.pagos.spring.demo.dtos.NotificacionPagoDTO;
import com.pagos.spring.demo.entities.Transaccion;
import com.pagos.spring.demo.repositories.TransaccionRepository;
import com.pagos.spring.demo.services.NotificacionPagoClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class VistasController {

    private final TransaccionRepository transaccionRepository;
    private final NotificacionPagoClient notificacionPagoClient;

    public VistasController(TransaccionRepository transaccionRepository,
                            NotificacionPagoClient notificacionPagoClient) {
        this.transaccionRepository = transaccionRepository;
        this.notificacionPagoClient = notificacionPagoClient;
    }

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

        String resolvedPaymentId = (paymentId != null) ? paymentId : collectionId;
        String resolvedStatus = (status != null) ? status : collectionStatus;

        // 0) Siempre cargamos lo que viene por query params al modelo
        model.addAttribute("paymentId", resolvedPaymentId);
        model.addAttribute("merchantOrderId", merchantOrderId);
        model.addAttribute("preferenceId", preferenceId);
        model.addAttribute("status", resolvedStatus);
        model.addAttribute("paymentType", paymentType);
        model.addAttribute("externalReference", externalReference);
        model.addAttribute("transactionAmount", transactionAmount);

        // Query params para debug
        Map<String, String> params = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> String.join(",", e.getValue())));
        model.addAttribute("queryParams", params);

        // --- Parte BD ---
        Optional<Transaccion> txOpt = Optional.empty();
        if (preferenceId != null) {
            txOpt = transaccionRepository.findByPreferenceId(preferenceId);
            txOpt.ifPresent(tx -> {
                model.addAttribute("db_nombre", tx.getNombre());
                model.addAttribute("db_email", tx.getEmail());
                model.addAttribute("db_titulo", tx.getTitulo());
                model.addAttribute("db_monto", tx.getMonto());
                model.addAttribute("db_moneda", tx.getMoneda());
                model.addAttribute("db_cantidad", tx.getCantidad());
                model.addAttribute("db_estado", tx.getEstado());
            });
        }

        // --- Parte Mercado Pago (opcional) ---
        String finalStatus = resolvedStatus;
        String finalPaymentType = paymentType;
        String finalTransactionAmount = transactionAmount;
        String finalMerchantOrderId = merchantOrderId;
        String finalExternalReference = externalReference;

        if (resolvedPaymentId != null) {
            try {
                Payment payment = new PaymentClient().get(Long.parseLong(resolvedPaymentId));

                finalStatus = payment.getStatus();
                finalPaymentType = payment.getPaymentTypeId();
                finalTransactionAmount = payment.getTransactionAmount() != null
                        ? payment.getTransactionAmount().toString()
                        : null;
                finalMerchantOrderId = (payment.getOrder() != null)
                        ? String.valueOf(payment.getOrder().getId())
                        : finalMerchantOrderId;
                finalExternalReference = payment.getExternalReference();

                model.addAttribute("status", finalStatus);
                model.addAttribute("paymentType", finalPaymentType);
                model.addAttribute("transactionAmount", finalTransactionAmount);
                model.addAttribute("merchantOrderId", finalMerchantOrderId);
                model.addAttribute("externalReference", finalExternalReference);

            } catch (Exception e) {
                System.out.println("No se pudo cargar payment: " + e.getMessage());
                model.addAttribute("paymentFetchError", e.getMessage());
            }
        }

        // --- Enviar notificación SOLO si tenemos email y es pago aprobado ---
        if (txOpt.isPresent()) {
            Transaccion tx = txOpt.get();

            String estadoPago = (finalStatus != null) ? finalStatus : tx.getEstado();

            // Puedes ajustar la condición si lo deseas
            if (estadoPago != null && estadoPago.equalsIgnoreCase("approved")) {
                NotificacionPagoDTO dto = new NotificacionPagoDTO();
                dto.setEmail(tx.getEmail());
                dto.setNombre(tx.getNombre());
                dto.setTitulo(tx.getTitulo());
                dto.setCantidad(tx.getCantidad());
                dto.setMonto(tx.getMonto());
                dto.setMoneda(tx.getMoneda());
                dto.setEstado(estadoPago);

                dto.setPaymentId(resolvedPaymentId);
                dto.setPaymentStatus(estadoPago);
                dto.setPaymentType(finalPaymentType);
                dto.setMerchantOrderId(finalMerchantOrderId);
                dto.setPreferenceId(preferenceId);
                dto.setExternalReference(finalExternalReference);
                dto.setTransactionAmountMP(finalTransactionAmount);

                notificacionPagoClient.enviar(dto);
            } else {
                System.out.println("No se envía correo: estadoPago = " + estadoPago);
            }
        } else {
            System.out.println("No se encontró transacción para preferenceId=" + preferenceId + " -> no se envía correo.");
        }

        return "pagosuccess_vista";
    }

    @GetMapping("pago/pending")
    public String pendingPago() { return "pagopending_vista"; }

    @GetMapping("pago/failure")
    public String failurePago() { return "pagofailure_vista"; }

    @GetMapping("prueba")
    public String Login() { return "Login"; }

    @GetMapping("/pagovista")
    public String verTransacciones(Model model) {
        List<Transaccion> transacciones = transaccionRepository.findAll();
        model.addAttribute("transacciones", transacciones);
        return "pagovista";
    }

    // Borrar UNA transacción por id
    @PostMapping("/pagovista/delete/{id}")
    public String borrarTransaccion(@PathVariable Long id) {
        transaccionRepository.deleteById(id);
        return "redirect:/pagovista";
    }

    // Borrar TODAS las transacciones
    @PostMapping("/pagovista/delete-all")
    public String borrarTodasTransacciones() {
        transaccionRepository.deleteAll();
        return "redirect:/pagovista";
    }
}

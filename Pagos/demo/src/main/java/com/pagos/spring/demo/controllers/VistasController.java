package com.pagos.spring.demo.controllers;

import com.pagos.spring.demo.entities.Transaccion;
import com.pagos.spring.demo.repositories.TransaccionRepository;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class VistasController {

    private final TransaccionRepository transaccionRepository;

    public VistasController(TransaccionRepository transaccionRepository) {
        this.transaccionRepository = transaccionRepository;
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

        // Guardar todos los query params
        Map<String, String> params = request.getParameterMap().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> String.join(",", e.getValue())));
        model.addAttribute("queryParams", params);

        // =============================================
        // 1) Cargar datos desde tu BD usando PreferenceId
        // =============================================
        if (preferenceId != null) {
            transaccionRepository.findByPreferenceId(preferenceId).ifPresent(tx -> {
                model.addAttribute("db_nombre", tx.getNombre());
                model.addAttribute("db_email", tx.getEmail());
                model.addAttribute("db_titulo", tx.getTitulo());
                model.addAttribute("db_monto", tx.getMonto());
                model.addAttribute("db_moneda", tx.getMoneda());
                model.addAttribute("db_cantidad", tx.getCantidad());
                model.addAttribute("db_estado", tx.getEstado());
            });
        }

        // =============================================
        // 2) Cargar datos frescos desde Mercado Pago
        // =============================================
        if (resolvedPaymentId != null) {
            try {
                Payment payment = new PaymentClient().get(Long.parseLong(resolvedPaymentId));

                model.addAttribute("paymentId", resolvedPaymentId);
                model.addAttribute("status", payment.getStatus());
                model.addAttribute("paymentType", payment.getPaymentTypeId());
                model.addAttribute("transactionAmount", payment.getTransactionAmount());

                if (payment.getOrder() != null) {
                    model.addAttribute("merchantOrderId", payment.getOrder().getId());
                }

                model.addAttribute("externalReference", payment.getExternalReference());

            } catch (Exception e) {
                System.out.println("No se pudo cargar payment: " + e.getMessage());
                model.addAttribute("paymentFetchError", e.getMessage());
            }
        }

        return "pagosuccess_vista";
    }

    @GetMapping("pago/pending")
    public String pendingPago() { return "pagopending_vista"; }

    @GetMapping("pago/failure")
    public String failurePago() { return "pagofailure_vista"; }

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
 
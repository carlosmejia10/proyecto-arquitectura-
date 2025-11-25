package com.pagos.spring.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class PagosController {

    public PagosController() {
        // Configura tu Access Token (usa el de PRUEBAS)
        MercadoPagoConfig.setAccessToken("TEST-8767910683876652-112421-75bd4e2e98eb83687ad2e685bf2bb499-539778771");
    }

    @GetMapping("/crear-pago")
    public String crearPago() {

        try {
            // 1. Crear ítem
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title("Casa en Miami")
                    .quantity(1)
                    .unitPrice(new BigDecimal("20000"))
                    .currencyId("COP")
                    .build();

           
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://localhost:13131/success")
                    .failure("https://localhost:13131/failure")
                    .pending("https://localhost:13131/pending")
                    .build();

            // 3. Crear la preferencia
            PreferenceRequest request = PreferenceRequest.builder()
                    .items(List.of(item))
                    .backUrls(backUrls)
                    .autoReturn("approved")   // redirige automáticamente cuando se aprueba
                    .build();

            // 4. Crear cliente
            PreferenceClient preferenceClient = new PreferenceClient();

            // 5. Crear preferencia
            Preference preference = preferenceClient.create(request);

            // 6. Retornar el link de pago de SANDBOX
            return preference.getSandboxInitPoint();

        } catch (Exception e) {
            return "Error al generar link de pago: " + e.getMessage();
        }
    }

}
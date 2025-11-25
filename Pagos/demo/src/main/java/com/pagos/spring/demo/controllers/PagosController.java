package com.pagos.spring.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import com.pagos.spring.demo.dtos.PagoRequest;
import com.pagos.spring.demo.entities.Transaccion;
import com.pagos.spring.demo.repositories.TransaccionRepository;
import java.math.BigDecimal;
import java.util.List;

@RestController
public class PagosController {
    private final TransaccionRepository transaccionRepository;
    private static final String URLPUBLICANGROK = "https://felipelondonocamposvargas.lat";
    public PagosController(TransaccionRepository transaccionRepository) {
         this.transaccionRepository = transaccionRepository;
        MercadoPagoConfig.setAccessToken("APP_USR-3929024855587074-112423-f909081a85de94c1c3d1081cca46b270-3013802509");
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
                    .success(URLPUBLICANGROK + "/pago/success")
                    .failure(URLPUBLICANGROK + "/pago/failure")
                    .pending(URLPUBLICANGROK + "/pago/pending")
                    .build();

            // 3. Crear la preferencia
            PreferenceRequest request = PreferenceRequest.builder()
                    .items(List.of(item))
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .notificationUrl(URLPUBLICANGROK + "/webhook/mp")   // redirige automáticamente cuando se aprueba
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

    @PostMapping("/crearpago")
public String crearPagoDinamico(@RequestBody PagoRequest req) {
    try {
        PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title(req.getTitulo())
                .quantity(req.getCantidad())
                .unitPrice(req.getPrecio())
                .currencyId("COP") // o req.getMoneda() si lo agregas
                .build();

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(URLPUBLICANGROK + "/pago/success")
                .failure(URLPUBLICANGROK + "/pago/failure")
                .pending(URLPUBLICANGROK + "/pago/pending")
                .build();

        PreferenceRequest request = PreferenceRequest.builder()
                .items(List.of(item))
                .backUrls(backUrls)
                .autoReturn("approved")
                .notificationUrl(URLPUBLICANGROK + "/webhook/mp")
                .build();

        Preference preference = new PreferenceClient().create(request);
        return preference.getSandboxInitPoint();
    } catch (Exception e) {
        return "Error al generar link de pago: " + e.getMessage();
    }
}



@PostMapping("/crearpago1")
    public String crearPagoDinamico1(@RequestBody PagoRequest req) {
        try {
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title(req.getTitulo())
                    .quantity(req.getCantidad())
                    .unitPrice(req.getPrecio())
                    .currencyId("COP")
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(URLPUBLICANGROK + "/pago/success")
                    .failure(URLPUBLICANGROK + "/pago/failure")
                    .pending(URLPUBLICANGROK + "/pago/pending")
                    .build();

            PreferenceRequest request = PreferenceRequest.builder()
                    .items(List.of(item))
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .notificationUrl(URLPUBLICANGROK + "/webhook/mp")
                    .build();

            Preference preference = new PreferenceClient().create(request);

            // 👇 Aquí guardas la transacción en tu BD
            Transaccion tx = new Transaccion();
            tx.setPreferenceId(preference.getId());
            tx.setTitulo(req.getTitulo());
            tx.setCantidad(req.getCantidad());
            tx.setMonto(req.getPrecio());
            tx.setMoneda("COP");
            tx.setNombre(req.getNombre());
            tx.setEmail(req.getEmail());
            tx.setEstado("CREATED");
            transaccionRepository.save(tx);

            // retornas el link para que el usuario pague
            return preference.getSandboxInitPoint(); // o getInitPoint() en prod

        } catch (Exception e) {
            return "Error al generar link de pago: " + e.getMessage();
        }
    }

    
    @GetMapping("/pagos")
    public List<Transaccion> listarPagos() {
    return transaccionRepository.findAll();
        }



}
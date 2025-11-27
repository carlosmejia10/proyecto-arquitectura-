package com.pagos.spring.demo.services;

import com.pagos.spring.demo.dtos.NotificacionPagoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificacionPagoClient {

    // RestTemplate simple, sin builder
    private final RestTemplate restTemplate = new RestTemplate();

    // URL del microservicio de mensajes (puerto 13131)
    @Value("${notificaciones.pago-aprobado.url:http://localhost:13131/api/notificaciones/pago-aprobado}")
    private String notificacionUrl;

    public void enviar(NotificacionPagoDTO dto) {
        try {
            ResponseEntity<Void> response =
                    restTemplate.postForEntity(notificacionUrl, dto, Void.class);
            System.out.println("Notificación enviada. Status: " + response.getStatusCode());
        } catch (Exception e) {
            System.out.println("Error enviando notificación de pago: " + e.getMessage());
        }
    }
}

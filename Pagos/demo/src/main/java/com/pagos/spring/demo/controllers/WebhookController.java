package com.pagos.spring.demo.controllers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WebhookController {

    @PostMapping("/webhook/mp")
    public ResponseEntity<String> webhook(@RequestBody Map<String, Object> body) {
        // Imprime todo lo que envía Mercado Pago
        System.out.println("Webhook MP payload: " + body);

        // Extrae datos útiles (type, id)
        String type = body.get("type") != null ? body.get("type").toString() : "unknown";
        Object dataObj = body.get("data");
        String id = null;
        if (dataObj instanceof Map) {
            Object idObj = ((Map<?, ?>) dataObj).get("id");
            id = idObj != null ? idObj.toString() : null;
        }

        System.out.println("Webhook type=" + type + " id=" + id);

        // Aquí podrías consultar la orden/pago y actualizar tu DB
        return ResponseEntity.ok("ok");
    }
}


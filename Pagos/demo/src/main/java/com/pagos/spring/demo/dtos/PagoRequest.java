package com.pagos.spring.demo.dtos;

import java.math.BigDecimal;

public class PagoRequest {
    private String titulo = "Prueba";
    private Integer cantidad = 1;
    private BigDecimal precio; // unitPrice
    // opcional: private String moneda;
    public Integer getCantidad() {
        return cantidad;
    }
    public BigDecimal getPrecio() {
        return precio;
    }
    public String getTitulo() {
        return titulo;
    }
    // getters/setters
}
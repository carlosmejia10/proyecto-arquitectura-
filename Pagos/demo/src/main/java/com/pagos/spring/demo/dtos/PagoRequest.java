package com.pagos.spring.demo.dtos;

import java.math.BigDecimal;

public class PagoRequest {
    private String titulo = "Prueba";
    private Integer cantidad = 1;
    private BigDecimal precio; 
     private String nombre;   
    private String email;
   
    public Integer getCantidad() {
        return cantidad;
    }
    public BigDecimal getPrecio() {
        return precio;
    }
    public String getTitulo() {
        return titulo;
    }
    public String getEmail() {
        return email;
    }
    public String getNombre() {
        return nombre;
    }
}
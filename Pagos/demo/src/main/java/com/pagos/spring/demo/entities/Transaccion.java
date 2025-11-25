package com.pagos.spring.demo.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transacciones")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String preferenceId;   // id de la preferencia en MP

    private String titulo;
    private Integer cantidad;
    private BigDecimal monto;
    private String moneda;

    private String nombre;
    private String email;

    private String estado;         // CREATED, PENDING, APPROVED, etc.

    private Instant creadaEn;

    @PrePersist
    public void prePersist() {
        this.creadaEn = Instant.now();
        if (this.estado == null) {
            this.estado = "CREATED";
        }
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public void setCreadaEn(Instant creadaEn) {
        this.creadaEn = creadaEn;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public void setPreferenceId(String preferenceId) {
        this.preferenceId = preferenceId;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public Integer getCantidad() {
        return cantidad;
    }
    public Instant getCreadaEn() {
        return creadaEn;
    }
    public String getEmail() {
        return email;
    }
    public String getEstado() {
        return estado;
    }
    public Long getId() {
        return id;
    }
    public String getMoneda() {
        return moneda;
    }
    public BigDecimal getMonto() {
        return monto;
    }
    public String getNombre() {
        return nombre;
    }
    public String getPreferenceId() {
        return preferenceId;
    }
    public String getTitulo() {
        return titulo;
    }
}
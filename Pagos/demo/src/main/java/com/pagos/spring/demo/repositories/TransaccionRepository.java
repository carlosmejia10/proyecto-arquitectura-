package com.pagos.spring.demo.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pagos.spring.demo.entities.Transaccion;

import java.util.Optional;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    Optional<Transaccion> findByPreferenceId(String preferenceId);
}
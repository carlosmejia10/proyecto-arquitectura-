package com.pagos.spring.demo.services;

import com.pagos.spring.demo.entities.Transaccion;
import com.pagos.spring.demo.repositories.TransaccionRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import static com.pagos.spring.demo.config.RabbitConfig.PAGOS_QUEUE;

@Service
public class TransaccionConsumer {

    private final TransaccionRepository transaccionRepository;

    public TransaccionConsumer(TransaccionRepository transaccionRepository) {
        this.transaccionRepository = transaccionRepository;
    }

    @RabbitListener(queues = PAGOS_QUEUE)
    public void recibirTransaccion(Transaccion tx) {
        System.out.println("Guardando transacción desde cola: " + tx.getPreferenceId());
        transaccionRepository.save(tx);
    }
}

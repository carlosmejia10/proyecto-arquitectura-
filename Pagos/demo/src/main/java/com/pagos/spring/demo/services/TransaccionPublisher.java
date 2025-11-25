package com.pagos.spring.demo.services;

import com.pagos.spring.demo.entities.Transaccion;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import static com.pagos.spring.demo.config.RabbitConfig.PAGOS_QUEUE;

@Service
public class TransaccionPublisher {

    private final Queue pagosQueue;

    private final RabbitTemplate rabbitTemplate;

    public TransaccionPublisher(RabbitTemplate rabbitTemplate, Queue pagosQueue) {
        this.rabbitTemplate = rabbitTemplate;
        this.pagosQueue = pagosQueue;
    }

    public void enviarTransaccion(Transaccion tx) {
        rabbitTemplate.convertAndSend(PAGOS_QUEUE, tx);
        System.out.println("Transacción enviada a RabbitMQ: " + tx.getPreferenceId());
    }
}

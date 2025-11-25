package com.pagos.spring.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class VistasController {
    @GetMapping("pago/success")
    public String SuccessPagoString(){

        return"pagosuccess_vista";
    }
      @GetMapping("pago/pending")
    public String PendingPagoString(){

        return"pagopending_vista";
    }  
    @GetMapping("pago/failure")
    public String FailurePagoString(){

        return"pagofailure_vista";
    }


}

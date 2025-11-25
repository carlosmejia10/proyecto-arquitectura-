package com.pagos.spring.demo.controllers;
import com.pagos.spring.demo.entities.Person;
import com.pagos.spring.demo.repositories.PersonRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/persons")
public class PersonController {

    private final PersonRepository repository;

    public PersonController(PersonRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Person create(@RequestBody Person person) {
        return repository.save(person);
    }

    @GetMapping
    public List<Person> list() {
        return repository.findAll();
    }
}
package com.pagos.spring.demo.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pagos.spring.demo.entities.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
}
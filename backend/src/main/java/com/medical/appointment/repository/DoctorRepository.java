package com.medical.appointment.repository;

import com.medical.appointment.entity.Doctor;
import com.medical.appointment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByAvailableTrue();
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}

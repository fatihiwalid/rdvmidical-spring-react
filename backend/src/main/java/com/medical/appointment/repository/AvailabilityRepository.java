package com.medical.appointment.repository;

import com.medical.appointment.entity.Availability;
import com.medical.appointment.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByDoctor(Doctor doctor);
    List<Availability> findByDoctorAndAvailableTrue(Doctor doctor);
    Optional<Availability> findByDoctorAndDayOfWeek(Doctor doctor, DayOfWeek dayOfWeek);
}

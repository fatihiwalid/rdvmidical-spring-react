package com.medical.appointment.repository;

import com.medical.appointment.entity.Doctor;
import com.medical.appointment.entity.MedicalRecord;
import com.medical.appointment.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient(Patient patient);
    List<MedicalRecord> findByDoctor(Doctor doctor);
    Optional<MedicalRecord> findByAppointmentId(Long appointmentId);
}

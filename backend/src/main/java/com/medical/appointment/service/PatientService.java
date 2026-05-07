package com.medical.appointment.service;

import com.medical.appointment.dto.request.UpdateProfileRequest;
import com.medical.appointment.dto.response.AppointmentDTO;
import com.medical.appointment.dto.response.PatientDTO;
import com.medical.appointment.entity.Patient;
import com.medical.appointment.entity.User;
import com.medical.appointment.exception.ResourceNotFoundException;
import com.medical.appointment.repository.AppointmentRepository;
import com.medical.appointment.repository.PatientRepository;
import com.medical.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return PatientDTO.from(patient);
    }

    @Transactional
    public PatientDTO updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getBloodType() != null) patient.setBloodType(request.getBloodType());
        if (request.getMedicalHistory() != null) patient.setMedicalHistory(request.getMedicalHistory());
        patientRepository.save(patient);

        return PatientDTO.from(patient);
    }

    public List<AppointmentDTO> getMyAppointments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(AppointmentDTO::from)
                .toList();
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(PatientDTO::from)
                .toList();
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return PatientDTO.from(patient);
    }
}

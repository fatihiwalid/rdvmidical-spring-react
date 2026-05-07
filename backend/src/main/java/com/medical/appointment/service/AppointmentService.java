package com.medical.appointment.service;

import com.medical.appointment.dto.request.AppointmentRequest;
import com.medical.appointment.dto.response.AppointmentDTO;
import com.medical.appointment.entity.*;
import com.medical.appointment.exception.BadRequestException;
import com.medical.appointment.exception.ResourceNotFoundException;
import com.medical.appointment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentDTO bookAppointment(String username, AppointmentRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Patient patient;
        if (request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        } else {
            patient = patientRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LocalDate date = LocalDate.parse(request.getAppointmentDate());

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(date)
                .startTime(request.getStartTime() != null ? LocalTime.parse(request.getStartTime()) : null)
                .endTime(request.getEndTime() != null ? LocalTime.parse(request.getEndTime()) : null)
                .reason(request.getReason())
                .notes(request.getNotes())
                .status(AppointmentStatus.PENDING)
                .createdBy(user)
                .build();

        appointment = appointmentRepository.save(appointment);
        return AppointmentDTO.from(appointment);
    }

    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        return AppointmentDTO.from(appointment);
    }

    @Transactional
    public AppointmentDTO cancelAppointment(String username, Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CONFIRMED
                || appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a confirmed or completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment = appointmentRepository.save(appointment);
        return AppointmentDTO.from(appointment);
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(AppointmentDTO::from)
                .toList();
    }

    public List<AppointmentDTO> searchByPatientName(String name) {
        return appointmentRepository.findAll()
                .stream()
                .filter(a -> (a.getPatient().getUser().getFirstName() + " " +
                        a.getPatient().getUser().getLastName()).toLowerCase().contains(name.toLowerCase()))
                .map(AppointmentDTO::from)
                .toList();
    }
}

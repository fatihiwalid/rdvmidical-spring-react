package com.medical.appointment.service;

import com.medical.appointment.dto.request.AvailabilityRequest;
import com.medical.appointment.dto.request.UpdateProfileRequest;
import com.medical.appointment.dto.response.AppointmentDTO;
import com.medical.appointment.dto.response.DoctorDTO;
import com.medical.appointment.entity.*;
import com.medical.appointment.exception.ResourceNotFoundException;
import com.medical.appointment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(DoctorDTO::from)
                .toList();
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return DoctorDTO.from(doctor);
    }

    public DoctorDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return DoctorDTO.from(doctor);
    }

    @Transactional
    public DoctorDTO updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        if (request.getBio() != null) doctor.setBio(request.getBio());
        if (request.getConsultationFee() != null) doctor.setConsultationFee(request.getConsultationFee());
        doctorRepository.save(doctor);

        return DoctorDTO.from(doctor);
    }

    public List<AppointmentDTO> getDoctorAppointments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        return appointmentRepository.findByDoctor(doctor)
                .stream()
                .map(AppointmentDTO::from)
                .toList();
    }

    @Transactional
    public AppointmentDTO updateAppointmentStatus(String username, Long appointmentId, String status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new ResourceNotFoundException("Appointment not assigned to this doctor");
        }

        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        appointment = appointmentRepository.save(appointment);
        return AppointmentDTO.from(appointment);
    }

    @Transactional
    public void setAvailability(String username, AvailabilityRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        DayOfWeek day = DayOfWeek.valueOf(request.getDayOfWeek().toUpperCase());

        Availability availability = availabilityRepository
                .findByDoctorAndDayOfWeek(doctor, day)
                .orElse(Availability.builder().doctor(doctor).dayOfWeek(day).build());

        availability.setStartTime(LocalTime.parse(request.getStartTime()));
        availability.setEndTime(LocalTime.parse(request.getEndTime()));
        availability.setAvailable(request.isAvailable());
        availabilityRepository.save(availability);
    }

    public List<Availability> getAvailability(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return availabilityRepository.findByDoctor(doctor);
    }
}

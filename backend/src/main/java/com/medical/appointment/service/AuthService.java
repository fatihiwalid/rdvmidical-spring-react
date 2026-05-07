package com.medical.appointment.service;

import com.medical.appointment.dto.request.LoginRequest;
import com.medical.appointment.dto.request.RegisterRequest;
import com.medical.appointment.dto.response.AuthResponse;
import com.medical.appointment.entity.*;
import com.medical.appointment.exception.BadRequestException;
import com.medical.appointment.repository.DoctorRepository;
import com.medical.appointment.repository.PatientRepository;
import com.medical.appointment.repository.UserRepository;
import com.medical.appointment.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .enabled(true)
                .build();

        user = userRepository.save(user);

        if (request.getRole() == RoleType.PATIENT) {
            Patient patient = Patient.builder()
                    .user(user)
                    .bloodType(request.getBloodType())
                    .address(request.getAddress())
                    .dateOfBirth(request.getDateOfBirth() != null
                            ? LocalDate.parse(request.getDateOfBirth()) : null)
                    .build();
            patientRepository.save(patient);
        } else if (request.getRole() == RoleType.MEDECIN) {
            Doctor doctor = Doctor.builder()
                    .user(user)
                    .specialization(request.getSpecialization() != null
                            ? request.getSpecialization() : "General")
                    .licenseNumber(request.getLicenseNumber())
                    .consultationFee(request.getConsultationFee())
                    .bio(request.getBio())
                    .available(true)
                    .build();
            doctorRepository.save(doctor);
        }

        String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}

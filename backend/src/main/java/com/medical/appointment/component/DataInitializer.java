package com.medical.appointment.component;

import com.medical.appointment.entity.*;
import com.medical.appointment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AvailabilityRepository availabilityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Sample data already loaded — skipping");
            return;
        }

        log.info("Loading sample data...");

        // Super Admin
        User admin = userRepository.save(User.builder()
                .firstName("Super").lastName("Admin")
                .username("admin").email("admin@medical.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("0600000001").role(RoleType.SUPER_ADMIN).enabled(true)
                .build());

        // Agent
        User agent = userRepository.save(User.builder()
                .firstName("Marie").lastName("Dupont")
                .username("agent1").email("agent@medical.com")
                .password(passwordEncoder.encode("agent123"))
                .phone("0600000002").role(RoleType.AGENT).enabled(true)
                .build());

        // Doctors
        User doctorUser1 = userRepository.save(User.builder()
                .firstName("Ahmed").lastName("Benali")
                .username("dr.benali").email("benali@medical.com")
                .password(passwordEncoder.encode("doctor123"))
                .phone("0600000003").role(RoleType.MEDECIN).enabled(true)
                .build());

        Doctor doctor1 = doctorRepository.save(Doctor.builder()
                .user(doctorUser1).specialization("Cardiologie")
                .licenseNumber("MED-001").consultationFee(500.0)
                .bio("Cardiologue avec 15 ans d'expérience.").available(true)
                .build());

        User doctorUser2 = userRepository.save(User.builder()
                .firstName("Fatima").lastName("Zahra")
                .username("dr.zahra").email("zahra@medical.com")
                .password(passwordEncoder.encode("doctor123"))
                .phone("0600000004").role(RoleType.MEDECIN).enabled(true)
                .build());

        Doctor doctor2 = doctorRepository.save(Doctor.builder()
                .user(doctorUser2).specialization("Pédiatrie")
                .licenseNumber("MED-002").consultationFee(400.0)
                .bio("Pédiatre spécialisée en nourrissons.").available(true)
                .build());

        User doctorUser3 = userRepository.save(User.builder()
                .firstName("Karim").lastName("Mansouri")
                .username("dr.mansouri").email("mansouri@medical.com")
                .password(passwordEncoder.encode("doctor123"))
                .phone("0600000005").role(RoleType.MEDECIN).enabled(true)
                .build());

        Doctor doctor3 = doctorRepository.save(Doctor.builder()
                .user(doctorUser3).specialization("Médecine Générale")
                .licenseNumber("MED-003").consultationFee(300.0)
                .bio("Médecin généraliste disponible.").available(true)
                .build());

        // Patients
        User patientUser1 = userRepository.save(User.builder()
                .firstName("Hassan").lastName("Moukrim")
                .username("patient1").email("hassan@example.com")
                .password(passwordEncoder.encode("patient123"))
                .phone("0600000006").role(RoleType.PATIENT).enabled(true)
                .build());

        patientRepository.save(Patient.builder()
                .user(patientUser1).dateOfBirth(LocalDate.of(1990, 5, 15))
                .bloodType("A+").address("Casablanca, Maroc")
                .medicalHistory("Hypertension légère").build());

        User patientUser2 = userRepository.save(User.builder()
                .firstName("Aicha").lastName("Benmoussa")
                .username("patient2").email("aicha@example.com")
                .password(passwordEncoder.encode("patient123"))
                .phone("0600000007").role(RoleType.PATIENT).enabled(true)
                .build());

        patientRepository.save(Patient.builder()
                .user(patientUser2).dateOfBirth(LocalDate.of(1985, 9, 22))
                .bloodType("O+").address("Rabat, Maroc")
                .medicalHistory("Diabète type 2").build());

        // Availabilities for doctor1
        DayOfWeek[] weekdays = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY};
        for (DayOfWeek day : weekdays) {
            availabilityRepository.save(Availability.builder()
                    .doctor(doctor1).dayOfWeek(day)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(17, 0))
                    .available(true).build());
        }

        log.info("Sample data loaded successfully.");
        log.info("=== Login Credentials ===");
        log.info("Admin:   admin / admin123");
        log.info("Agent:   agent1 / agent123");
        log.info("Doctor:  dr.benali / doctor123");
        log.info("Patient: patient1 / patient123");
    }
}

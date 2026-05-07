package com.medical.appointment.controller;

import com.medical.appointment.dto.request.AppointmentRequest;
import com.medical.appointment.dto.response.AppointmentDTO;
import com.medical.appointment.dto.response.PatientDTO;
import com.medical.appointment.service.AppointmentService;
import com.medical.appointment.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
@Tag(name = "Agent", description = "Agent management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AgentController {

    private final AppointmentService appointmentService;
    private final PatientService patientService;

    @PostMapping("/appointments")
    @Operation(summary = "Create appointment for a patient")
    public ResponseEntity<AppointmentDTO> createAppointment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(userDetails.getUsername(), request));
    }

    @GetMapping("/appointments")
    @Operation(summary = "Get all appointments")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/appointments/search")
    @Operation(summary = "Search appointments by patient name")
    public ResponseEntity<List<AppointmentDTO>> searchAppointments(@RequestParam String name) {
        return ResponseEntity.ok(appointmentService.searchByPatientName(name));
    }

    @GetMapping("/patients")
    @Operation(summary = "Get all patients")
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }
}

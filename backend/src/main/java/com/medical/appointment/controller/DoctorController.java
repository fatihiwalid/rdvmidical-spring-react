package com.medical.appointment.controller;

import com.medical.appointment.dto.request.AvailabilityRequest;
import com.medical.appointment.dto.request.UpdateProfileRequest;
import com.medical.appointment.dto.response.AppointmentDTO;
import com.medical.appointment.dto.response.DoctorDTO;
import com.medical.appointment.entity.Availability;
import com.medical.appointment.service.DoctorService;
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
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor", description = "Doctor management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get all doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current doctor profile")
    public ResponseEntity<DoctorDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(doctorService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update doctor profile")
    public ResponseEntity<DoctorDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(doctorService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/appointments")
    @Operation(summary = "Get doctor's appointments")
    public ResponseEntity<List<AppointmentDTO>> getAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(doctorService.getDoctorAppointments(userDetails.getUsername()));
    }

    @PutMapping("/appointments/{id}/status")
    @Operation(summary = "Accept or reject an appointment")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(doctorService.updateAppointmentStatus(userDetails.getUsername(), id, status));
    }

    @PostMapping("/availability")
    @Operation(summary = "Set doctor availability for a day")
    public ResponseEntity<Void> setAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AvailabilityRequest request) {
        doctorService.setAvailability(userDetails.getUsername(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Get doctor availability")
    public ResponseEntity<List<Availability>> getAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getAvailability(id));
    }
}

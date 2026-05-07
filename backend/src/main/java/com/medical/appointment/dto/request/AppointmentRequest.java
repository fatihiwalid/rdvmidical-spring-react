package com.medical.appointment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    private Long patientId;

    @NotNull(message = "Appointment date is required")
    private String appointmentDate;

    private String startTime;

    private String endTime;

    private String reason;

    private String notes;
}

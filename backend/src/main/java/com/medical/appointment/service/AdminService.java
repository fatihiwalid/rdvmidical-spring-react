package com.medical.appointment.service;

import com.medical.appointment.dto.response.StatsDTO;
import com.medical.appointment.dto.response.UserDTO;
import com.medical.appointment.entity.AppointmentStatus;
import com.medical.appointment.entity.RoleType;
import com.medical.appointment.entity.User;
import com.medical.appointment.exception.ResourceNotFoundException;
import com.medical.appointment.repository.AppointmentRepository;
import com.medical.appointment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::from)
                .toList();
    }

    public UserDTO getUserById(Long id) {
        return UserDTO.from(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Transactional
    public UserDTO toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        return UserDTO.from(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public StatsDTO getStats() {
        return StatsDTO.builder()
                .totalPatients(userRepository.findByRole(RoleType.PATIENT).size())
                .totalDoctors(userRepository.findByRole(RoleType.MEDECIN).size())
                .totalAgents(userRepository.findByRole(RoleType.AGENT).size())
                .totalAppointments(appointmentRepository.count())
                .pendingAppointments(appointmentRepository.countByStatus(AppointmentStatus.PENDING))
                .confirmedAppointments(appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED))
                .cancelledAppointments(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED))
                .completedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED))
                .build();
    }
}

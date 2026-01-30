package ma.betteryou.betteryoubackend.service;

import ma.betteryou.betteryoubackend.dto.WorkoutDetailResponse;
import ma.betteryou.betteryoubackend.model.Workout;
import ma.betteryou.betteryoubackend.repository.Workout.WorkoutRepository;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service

public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public List<Workout> getAll() {
        return workoutRepository.findAll();
    }

    public WorkoutDetailResponse getWorkoutDetail(Long id) {
        Workout w = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id " + id));

        List<String> benefits = parseListField(w.getBenefits());
        List<String> steps = parseListField(w.getSteps());

        return new WorkoutDetailResponse(
                w.getId(),
                w.getTitle(),
                w.getImageUrl(),
                w.getOverview(),
                benefits,
                steps
        );
    }

    private List<String> parseListField(String field) {
        if (field == null || field.isBlank()) {
            return List.of();
        }
        return Arrays.stream(field.split("\\|\\|"))
                     .map(String::trim)
                     .toList();
    }
}




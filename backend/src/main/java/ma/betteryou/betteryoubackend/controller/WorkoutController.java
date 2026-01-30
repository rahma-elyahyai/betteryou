package ma.betteryou.betteryoubackend.controller;

import ma.betteryou.betteryoubackend.dto.WorkoutDetailResponse;
import ma.betteryou.betteryoubackend.model.Workout;
import ma.betteryou.betteryoubackend.service.WorkoutService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:3000")

public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutService.getAll();
    }

    @GetMapping("/{id}/detail")
    public WorkoutDetailResponse getDetail(@PathVariable Long id) {
        return workoutService.getWorkoutDetail(id);
    }
}

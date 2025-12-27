package ma.betteryou.betteryoubackend.repository;

import ma.betteryou.betteryoubackend.entity.enums.ProgramStatus;
import ma.betteryou.betteryoubackend.entity.user.User;
import ma.betteryou.betteryoubackend.entity.workout.WorkoutProgram;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkoutProgramRepository extends JpaRepository<WorkoutProgram, Long> {
    // choisit juste le dernier programme parce que user peut avoit plusieurs programmes et on choisit de travailler juste le derniere par notre methode
    Optional<WorkoutProgram> findFirstByUser_IdUserAndProgramStatusOrderByStartDateDesc(
        long idUser,
        ProgramStatus status
    );
}

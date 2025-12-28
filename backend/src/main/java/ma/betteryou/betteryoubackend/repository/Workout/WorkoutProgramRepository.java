package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.WorkoutProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkoutProgramRepository extends JpaRepository<WorkoutProgram, Long> {

    @Query("""
            select distinct p
            from WorkoutProgram p
            left join fetch p.sessions s
            where p.user.id = :userId
           """)
    List<WorkoutProgram> findWithSessionsByUserId(@Param("userId") Integer userId);
}

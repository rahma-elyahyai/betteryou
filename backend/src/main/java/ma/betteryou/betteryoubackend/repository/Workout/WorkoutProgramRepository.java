package ma.betteryou.betteryoubackend.repository.Workout;

import ma.betteryou.betteryoubackend.model.WorkoutProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.List;

public interface WorkoutProgramRepository extends JpaRepository<WorkoutProgram, Long> {

    @Query("""
    select distinct p
    from WorkoutProgram p
    left join fetch p.sessions s
    where p.user.id = :userId
        and p.programStatus = 'ONGOING'

    """)
    List<WorkoutProgram> findActiveProgramsByUserId(@Param("userId") Integer userId);

    List<WorkoutProgram> findByProgramStatusAndExpectedEndDateBefore(
        String programStatus,
        LocalDate date
    );
 @Modifying
@Transactional
@Query("""
DELETE FROM WorkoutProgram p
WHERE (p.programStatus = 'ONGOING' AND p.expectedEndDate < :today)
   OR  p.programStatus = 'COMPLETED'
""")
int deleteFinishedPrograms(@Param("today") LocalDate today);

}

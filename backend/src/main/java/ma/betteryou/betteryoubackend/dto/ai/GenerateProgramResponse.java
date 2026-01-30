// GenerateProgramResponse.java
package ma.betteryou.betteryoubackend.dto.ai;

public record GenerateProgramResponse(
        Long programId,
        String programName,
        String goal,
        String startDate,
        String endDate
) {}

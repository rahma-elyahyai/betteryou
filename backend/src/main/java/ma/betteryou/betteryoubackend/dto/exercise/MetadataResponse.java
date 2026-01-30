package ma.betteryou.betteryoubackend.dto.exercise;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class MetadataResponse {
    private List<OptionDto> sessionTypes;
    private List<OptionDto> equipmentOptions;
    private List<String> muscles;
}

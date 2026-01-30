package ma.betteryou.betteryoubackend.service;

import lombok.RequiredArgsConstructor;
import ma.betteryou.betteryoubackend.dto.exercise.ExerciseSearchResponse;
import ma.betteryou.betteryoubackend.dto.exercise.MetadataResponse;
import ma.betteryou.betteryoubackend.dto.exercise.OptionDto;
import ma.betteryou.betteryoubackend.model.ExerciseR;
import ma.betteryou.betteryoubackend.repository.Workout.ExerciseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgramWizardService {

    private final ExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public MetadataResponse getMetadata() {
        MetadataResponse res = new MetadataResponse();

        res.setSessionTypes(List.of(
                new OptionDto("CARDIO", "Cardio", "🏃"),
                new OptionDto("STRENGTH", "Strength", "💪"),
                new OptionDto("MIXED", "Mixed", "🔥")
        ));

        res.setEquipmentOptions(List.of(
                new OptionDto("FULL_GYM", "Full Gym", "🏋️"),
                new OptionDto("HOME", "Home", "🏠"),
                new OptionDto("MINIMAL", "Minimal", "🎒")
        ));

        // muscles depuis la DB (targetMuscle peut contenir "Chest, Triceps")
        List<ExerciseR> all = exerciseRepository.findAll();
        Set<String> muscles = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

        for (ExerciseR e : all) {
            String tm = safe(e.getTargetMuscle());
            if (!tm.isBlank()) {
                for (String part : tm.split("[,|/]")) {
                    String m = part.trim();
                    if (!m.isBlank()) muscles.add(capitalize(m));
                }
            }
        }

        res.setMuscles(new ArrayList<>(muscles));
        return res;
    }

    @Transactional(readOnly = true)
    public List<ExerciseSearchResponse> searchExercises(String category, String equipment, List<String> muscles) {
        List<ExerciseR> all = exerciseRepository.findAll();

        String cat = safe(category).toUpperCase(Locale.ROOT);
        String eq = safe(equipment).toUpperCase(Locale.ROOT);

        List<String> wantedMuscles = muscles == null ? List.of() :
                muscles.stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(s -> !s.isBlank())
                        .map(s -> s.toUpperCase(Locale.ROOT))
                        .toList();

        return all.stream()
                .filter(e -> {
                    // filter category
                    if (!cat.isBlank()) {
                        String exCat = safe(e.getExerciseCategory()).toUpperCase(Locale.ROOT);
                        if (!exCat.equals(cat)) return false;
                    }

                    // filter equipment
                    if (!eq.isBlank()) {
                        //String exEq = safe(e.getEquipmentsNeeded()).toUpperCase(Locale.ROOT);
                        // parfois DB contient "FULL_GYM, HOME" -> on accepte contains
                        //if (!exEq.contains(eq)) return false;
                    }

                    // filter muscles: au moins 1 muscle match dans targetMuscle
                    if (!wantedMuscles.isEmpty()) {
                        String tm = safe(e.getTargetMuscle()).toUpperCase(Locale.ROOT);
                        boolean match = wantedMuscles.stream().anyMatch(tm::contains);
                        if (!match) return false;
                    }

                    return true;
                })
                .map(e -> new ExerciseSearchResponse(
                        e.getId(),
                        e.getExerciseName(),
                        e.getExerciseCategory(),
                        e.getTargetMuscle(),
                        e.getEquipmentsNeeded(),
                        e.getDifficultyLevel()
                ))
                .collect(Collectors.toList());
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }

    private String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}

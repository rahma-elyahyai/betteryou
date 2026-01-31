package ma.betteryou.betteryoubackend.repository.Nutrition;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MealRepositoryImpl implements MealRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional
    public Long insertMealReturningId(
            String description,
            String foodPreferences,
            String goal,
            String imageUrl,
            String mealName,
            String mealStatus,
            String mealType,
            String prepStepsJson
    ) {
        Object id = em.createNativeQuery("""
            INSERT INTO meal
            (description, food_preferences, goal, image_url, meal_name, meal_status, meal_type, preparation_steps)
            VALUES
            (?1, ?2, ?3, ?4, ?5, ?6, ?7, CAST(?8 AS jsonb))
            RETURNING id_meal
        """)
        .setParameter(1, description)
        .setParameter(2, foodPreferences)
        .setParameter(3, goal)
        .setParameter(4, imageUrl)
        .setParameter(5, mealName)
        .setParameter(6, mealStatus)
        .setParameter(7, mealType)
        .setParameter(8, prepStepsJson)
        .getSingleResult();

        // Postgres يرجع غالباً BigInteger
        if (id instanceof Number n) return n.longValue();
        return Long.valueOf(String.valueOf(id));
    }
}

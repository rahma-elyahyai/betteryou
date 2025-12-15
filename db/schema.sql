-- =========================================================
-- 1. TABLE UTILISATEUR
-- =========================================================

CREATE TABLE USERS (
    id_user            SERIAL PRIMARY KEY,
    first_name         VARCHAR(50)      NOT NULL,
    last_name          VARCHAR(50)      NOT NULL,
    email              VARCHAR(100)     NOT NULL,
    password           VARCHAR(255)     NOT NULL,
    birth_date         DATE,
    gender             VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    height_cm          INT,
    initial_weight_kg  DECIMAL(5,2),
    target_weight_kg   DECIMAL(5,2),
    goal               VARCHAR(20) CHECK (goal IN ('LOSE_WEIGHT','MAINTAIN','GAIN_MASS')),
    fitness_level      VARCHAR(20) CHECK (fitness_level IN ('BEGINNER','INTERMEDIATE','ADVANCED')),
    activity_level     VARCHAR(20) CHECK (activity_level IN ('SEDENTARY','MODERATE','ACTIVE')),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_user_email UNIQUE (email)
);

-- =========================================================
-- 2. TABLE PROGRAMME SPORTIF
--    (USER 1,n WORKOUT_PROGRAM)
-- =========================================================

CREATE TABLE WORKOUT_PROGRAM (
    id_program        SERIAL PRIMARY KEY,
    program_name      VARCHAR(100)     NOT NULL,
    description       VARCHAR(255),
    generation_type   VARCHAR(20) CHECK (generation_type IN ('AUTO_AI','MANUAL')),
    goal              VARCHAR(20) CHECK (goal IN ('LOSE_WEIGHT','MAINTAIN','GAIN_MASS')),
    start_date        DATE,
    expected_end_date DATE,
    program_status    VARCHAR(20) CHECK (program_status IN ('ONGOING','COMPLETED','CANCELLED')),

    id_user           INT NOT NULL,
    CONSTRAINT fk_program_user
        FOREIGN KEY (id_user)
        REFERENCES USERS(id_user)
        ON DELETE CASCADE
);

-- =========================================================
-- 3. TABLE SEANCE D'ENTRAINEMENT
--    (WORKOUT_PROGRAM 1,n WORKOUT_SESSION)
-- =========================================================

CREATE TABLE WORKOUT_SESSION (
    id_session       SERIAL PRIMARY KEY,
    session_date     DATE,
    duration_minutes INT,
    session_type     VARCHAR(20) CHECK (session_type IN ('CARDIO','STRENGTH','MIXED')),
    session_status   VARCHAR(20) CHECK (session_status IN ('PLANNED','DONE','MISSED')),

    id_program       INT NOT NULL,
    CONSTRAINT fk_session_program
        FOREIGN KEY (id_program)
        REFERENCES WORKOUT_PROGRAM(id_program)
        ON DELETE CASCADE
);

-- =========================================================
-- 4. TABLE EXERCICE
-- =========================================================

CREATE TABLE EXERCISE (
    id_exercise        SERIAL PRIMARY KEY,
    exercise_name      VARCHAR(100)    NOT NULL,
    description        VARCHAR(255),
    target_muscle      VARCHAR(100),
    equipments_needed  VARCHAR(255),
    difficulty_level   VARCHAR(20) CHECK (difficulty_level IN ('EASY','MODERATE','HARD')),
    exercise_category  VARCHAR(30) CHECK (exercise_category IN ('CARDIO','STRENGTH','FLEXIBILITY','BALANCE')),
    duration_min       INT
);

-- =========================================================
-- 5. TABLE D'ASSOCIATION SESSION_EXERCISE
--    (N,N entre WORKOUT_SESSION et EXERCISE)
-- =========================================================

CREATE TABLE SESSION_EXERCISE (
    id_session       INT NOT NULL,
    id_exercise      INT NOT NULL,
    sets             INT,
    reps             INT,
    rest_seconds     INT,
    order_in_session INT,

    CONSTRAINT pk_session_exercise
        PRIMARY KEY (id_session, id_exercise),

    CONSTRAINT fk_sess_ex_session
        FOREIGN KEY (id_session)
        REFERENCES WORKOUT_SESSION (id_session)
        ON DELETE CASCADE,

    CONSTRAINT fk_sess_ex_exercise
        FOREIGN KEY (id_exercise)
        REFERENCES EXERCISE(id_exercise)
        ON DELETE CASCADE
);

-- =========================================================
-- 6. TABLE PLAN NUTRITIONNEL
--    (USER 1,n NUTRITION_PLAN)
-- =========================================================

CREATE TABLE NUTRITION_PLAN (
    id_nutrition     SERIAL PRIMARY KEY,
    nutrition_name   VARCHAR(100)    NOT NULL,
    start_date       DATE,
    end_date         DATE,
    objective        VARCHAR(255),
    description      VARCHAR(255),
    calories_per_day INT,

    id_user          INT NOT NULL,
    CONSTRAINT fk_nutrition_user
        FOREIGN KEY (id_user)
        REFERENCES USERS(id_user)
        ON DELETE CASCADE
);

-- =========================================================
-- 7. TABLE MEAL (repas)
-- =========================================================

CREATE TABLE MEAL (
    id_meal       SERIAL PRIMARY KEY,
    meal_name     VARCHAR(100)   NOT NULL,
    description   VARCHAR(255),
    meal_type     VARCHAR(50),   -- BREAKFAST / LUNCH / DINNER / SNACK...
    image_url     VARCHAR(255)
);

-- =========================================================
-- 8. TABLE FOOD_ITEM (catalogue aliments)
-- =========================================================

CREATE TABLE FOOD_ITEM (
    id_food           SERIAL PRIMARY KEY,
    food_name         VARCHAR(100)   NOT NULL,
    description       VARCHAR(255),
    calories_per_100g DECIMAL(6,2),
    proteins_per_100g DECIMAL(6,2),
    carbs_per_100g    DECIMAL(6,2),
    fats_per_100g     DECIMAL(6,2)
);

-- =========================================================
-- 9. TABLE D'ASSOCIATION CONTAINS (MEAL, FOOD_ITEM)
--    correspond à la relation "contains" du MCD/MLD
-- =========================================================

CREATE TABLE CONTAINS (
    id_meal        INT NOT NULL,
    id_food        INT NOT NULL,
    quantity_grams DECIMAL(6,2),

    CONSTRAINT pk_contains
        PRIMARY KEY (id_meal, id_food),

    CONSTRAINT fk_contains_meal
        FOREIGN KEY (id_meal)
        REFERENCES MEAL(id_meal)
        ON DELETE CASCADE,

    CONSTRAINT fk_contains_food
        FOREIGN KEY (id_food)
        REFERENCES FOOD_ITEM(id_food)
        ON DELETE CASCADE
);

-- =========================================================
-- 10. TABLE D'ASSOCIATION COMPOSED_OF (NUTRITION_PLAN, MEAL)
--     correspond à l'entité-association "composed_of"
-- =========================================================

CREATE TABLE COMPOSED_OF (
    id_nutrition INT NOT NULL,
    id_meal      INT NOT NULL,

    CONSTRAINT pk_composed_of
        PRIMARY KEY (id_nutrition, id_meal),

    CONSTRAINT fk_composed_nutrition
        FOREIGN KEY (id_nutrition)
        REFERENCES NUTRITION_PLAN(id_nutrition)
        ON DELETE CASCADE,

    CONSTRAINT fk_composed_meal
        FOREIGN KEY (id_meal)
        REFERENCES MEAL(id_meal)
        ON DELETE CASCADE
);

-- =========================================================
-- 11. TABLE CHAT_MESSAGE
--     (USER 1,n CHAT_MESSAGE)
-- =========================================================

CREATE TABLE CHAT_MESSAGE (
    id_message    SERIAL PRIMARY KEY,
    message_time  TIMESTAMP      NOT NULL,
    message_text  TEXT           NOT NULL,
    sender_role   VARCHAR(10) CHECK (sender_role IN ('USER','AI')),

    id_user       INT NOT NULL,
    CONSTRAINT fk_message_user
        FOREIGN KEY (id_user)
        REFERENCES USERS(id_user)
        ON DELETE CASCADE
);

-- =========================================================
-- 12. TABLE AI_CALL_LOG
--     (CHAT_MESSAGE 1,0..1 AI_CALL_LOG)
-- =========================================================

CREATE TABLE AI_CALL_LOG (
    id_call          SERIAL PRIMARY KEY,
    status           VARCHAR(20),   -- tu peux ajouter un CHECK si tu veux fixer les valeurs
    called_at        TIMESTAMP,
    request_payload  TEXT,
    response_payload TEXT,
    model_used       VARCHAR(50),

    id_message       INT NOT NULL,
    CONSTRAINT uq_aicall_message UNIQUE (id_message),

    CONSTRAINT fk_aicall_message
        FOREIGN KEY (id_message)
        REFERENCES CHAT_MESSAGE(id_message)
        ON DELETE CASCADE
);

package ma.betteryou.betteryoubackend;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableScheduling
@SpringBootApplication
public class BetteryouBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BetteryouBackendApplication.class, args);
	}

}

package ma.betteryou.betteryoubackend.dto.program;

public class RecentSessionDto {

    private Long id;        // id_session -> pour le front
    private String date;    // "2025-01-24"
    private String title;   // session_type
    private String status;  // DONE / PLANNED


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    
}

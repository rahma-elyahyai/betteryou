package ma.betteryou.betteryoubackend.service.dashboard;

import ma.betteryou.betteryoubackend.dto.dashboard.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboardForUser(long userId);

}

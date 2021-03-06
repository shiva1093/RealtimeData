package de.tub.app.apputil;

import de.tub.app.Config;
import de.tub.app.domain.weather.GeoLocation;
import de.tub.app.domain.weather.WeatherDetails;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author Naveed Kamran
 */
@Component
public class WeatherUtil {

    @Autowired
    private ObjFactory objFactory;

    public Date getDateMinsBefore(int mins) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.MINUTE, -mins);

        return cal.getTime();
    }

    private void saveWeather(WeatherDetails weather, GeoLocation location) {
        weather.setDateCreated(Calendar.getInstance().getTime());
        objFactory.getWeatherRepository().save(weather);
    }

    private void saveWeather(WeatherDetails weather, String location) {
        weather.setDateCreated(Calendar.getInstance().getTime());
        objFactory.getWeatherRepository().save(weather);
    }

    public WeatherDetails getWeather(GeoLocation location) {
        List<WeatherDetails> exWeatherDetails = objFactory.getWeatherRepository().findByDateCreatedBetween(
                getDateMinsBefore(Config.WEATHER_EXPIRTY), Calendar.getInstance().getTime());
        WeatherDetails weather = null;
        for (WeatherDetails weatherDetail : exWeatherDetails) {
            if (weatherDetail.getCoord().equals(location)) {
                weather = weatherDetail;
                break;
            }
        }

        if (weather == null) {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://api.openweathermap.org/data/2.5/weather?lat=" + location.getLat()
                    + "&lon=" + location.getLon() + "&appid=" + Config.OPEN_WEATHER_APP_ID;
            System.out.println("Calling webservice " + url);
            weather = restTemplate.getForObject(url, WeatherDetails.class);
            this.saveWeather(weather, location);
        } else {
            System.out.println("Using an existing weather information.");
        }

        objFactory.getWeatherRepository().save(weather);

        return weather;
    }

    public WeatherDetails getWeather(String query) {
        List<WeatherDetails> exWeatherDetails = objFactory.getWeatherRepository().findByDateCreatedBetween(getDateMinsBefore(Config.WEATHER_EXPIRTY), Calendar.getInstance().getTime());
        WeatherDetails weather = null;
        for (WeatherDetails weatherDetail : exWeatherDetails) {
            if (weatherDetail.getName().equals(query)) {
                weather = weatherDetail;
                break;
            }
        }

        if (weather == null) {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + Config.OPEN_WEATHER_APP_ID;
            System.out.println("Calling webservice " + url);
            weather = restTemplate.getForObject(url, WeatherDetails.class);
            this.saveWeather(weather, query);
        } else {
            System.out.println("Using an existing weather information.");
        }
        return weather;
    }
}

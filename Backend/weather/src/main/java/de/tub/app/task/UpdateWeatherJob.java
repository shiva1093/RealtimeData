package de.tub.app.task;

import de.tub.app.Config;
import de.tub.app.apputil.ObjFactory;
import de.tub.app.domain.weather.GeoLocation;
import de.tub.app.domain.weather.WeatherDetails;
import com.datenc.commons.date.DateUtil;
import com.google.gson.Gson;
import java.util.Calendar;
import java.util.List;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 *
 * @author Naveed Kamran
 */
@Component
public class UpdateWeatherJob implements Runnable, ApplicationContextAware {

    ApplicationContext applicationContext = null;
    @Autowired
    private ObjFactory objFactory;

    @Scheduled(cron = Config.CRONE_WEATHER_RELOAD)
    @Override
    public void run() {
        System.out.println(DateUtil.getInstance().getDateTimeAsString(Calendar.getInstance().getTime()) + " UpdateWeatherJob executing .....");
        try {
            List<GeoLocation> subs = objFactory.getWeatherSubsRepository().findAll();
            for (GeoLocation location : subs) {
                WeatherDetails weatherDetails = objFactory.getAppUtil().getWeather(location);

                System.out.println("Sending to RabbitMQ ...");
                objFactory.getRabbitTemplate().convertAndSend("amq.topic", Config.ROUNTING_KEY_BEGIN, new Gson().toJson(weatherDetails));
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        System.out.println("UpdateWeatherJob execution completed");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
        this.applicationContext = applicationContext;
    }

}
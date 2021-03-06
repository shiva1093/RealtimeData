package de.tub.app.apputil;

import de.tub.app.repository.RabbitMessageRepository;
import de.tub.app.repository.WeatherRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import de.tub.app.repository.SunInfoRepository;

/**
 *
 * @author Naveed Kamran
 */
@Component
public class ObjFactory {

    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private RabbitUtil rabbitUtil;
    ////////////////////////////////////////////////////////////////////////////
    @Autowired
    private AppUtil appUtil;
    @Autowired
    private ConditionUtil conditionUtil;
    @Autowired
    private WeatherUtil weatherUtil;
    @Autowired
    private SunInfoUtil sunInfoUtil;
    @Autowired
    private SunInfoRepository dayInfoRepository;
    @Autowired
    private RabbitMessageRepository rabbitMessageRepository;
    @Autowired
    private WeatherRepository weatherRepository;

    /**
     * @return the rabbitTemplate
     */
    public RabbitTemplate getRabbitTemplate() {
        return rabbitTemplate;
    }

    /**
     * @param rabbitTemplate the rabbitTemplate to set
     */
    public void setRabbitTemplate(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * @return the appUtil
     */
    public AppUtil getAppUtil() {
        return appUtil;
    }

    /**
     * @param appUtil the appUtil to set
     */
    public void setAppUtil(AppUtil appUtil) {
        this.appUtil = appUtil;
    }

    /**
     * @return the conditionUtil
     */
    public ConditionUtil getConditionUtil() {
        return conditionUtil;
    }

    /**
     * @param conditionUtil the conditionUtil to set
     */
    public void setConditionUtil(ConditionUtil conditionUtil) {
        this.conditionUtil = conditionUtil;
    }

    /**
     * @return the weatherUtil
     */
    public WeatherUtil getWeatherUtil() {
        return weatherUtil;
    }

    /**
     * @param weatherUtil the weatherUtil to set
     */
    public void setWeatherUtil(WeatherUtil weatherUtil) {
        this.weatherUtil = weatherUtil;
    }

    /**
     * @return the sunInfoUtil
     */
    public SunInfoUtil getSunInfoUtil() {
        return sunInfoUtil;
    }

    /**
     * @param sunInfoUtil the sunInfoUtil to set
     */
    public void setSunInfoUtil(SunInfoUtil sunInfoUtil) {
        this.sunInfoUtil = sunInfoUtil;
    }

    /**
     * @return the dayInfoRepository
     */
    public SunInfoRepository getDayInfoRepository() {
        return dayInfoRepository;
    }

    /**
     * @param dayInfoRepository the dayInfoRepository to set
     */
    public void setDayInfoRepository(SunInfoRepository dayInfoRepository) {
        this.dayInfoRepository = dayInfoRepository;
    }

    /**
     * @return the rabbitMessageRepository
     */
    public RabbitMessageRepository getRabbitMessageRepository() {
        return rabbitMessageRepository;
    }

    /**
     * @param rabbitMessageRepository the rabbitMessageRepository to set
     */
    public void setRabbitMessageRepository(RabbitMessageRepository rabbitMessageRepository) {
        this.rabbitMessageRepository = rabbitMessageRepository;
    }

    /**
     * @return the weatherRepository
     */
    public WeatherRepository getWeatherRepository() {
        return weatherRepository;
    }

    /**
     * @param weatherRepository the weatherRepository to set
     */
    public void setWeatherRepository(WeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    /**
     * @return the rabbitUtil
     */
    public RabbitUtil getRabbitUtil() {
        return rabbitUtil;
    }

    /**
     * @param rabbitUtil the rabbitUtil to set
     */
    public void setRabbitUtil(RabbitUtil rabbitUtil) {
        this.rabbitUtil = rabbitUtil;
    }

}

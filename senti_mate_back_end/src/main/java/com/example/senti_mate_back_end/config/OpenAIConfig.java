package com.example.senti_mate_back_end.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.DefaultHttpRequestRetryStrategy;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.util.TimeValue;
import org.apache.hc.core5.util.Timeout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for OpenAI ChatGPT API
 */
@Configuration
@EnableConfigurationProperties(OpenAIProperties.class)
@EnableRetry
@Slf4j
public class OpenAIConfig {

    @Autowired
    private OpenAIProperties openAIProperties;

    /**
     * Creates a RestTemplate bean for OpenAI API calls with proper configuration
     * @return the RestTemplate bean
     */
    @Bean
    @Qualifier("openAIRestTemplate")
    public RestTemplate openAIRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // HTTP client configuration
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(Timeout.ofMilliseconds(openAIProperties.getConnectTimeout()))
                .setResponseTimeout(Timeout.ofMilliseconds(openAIProperties.getReadTimeout()))
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setDefaultRequestConfig(requestConfig)
                .setRetryStrategy(new DefaultHttpRequestRetryStrategy(
                    openAIProperties.getMaxRetries(), 
                    TimeValue.ofMilliseconds(openAIProperties.getRetryDelay())))
                .build();

        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory(httpClient);
        restTemplate.setRequestFactory(factory);

        // Add interceptors
        restTemplate.getInterceptors().add(new OpenAIApiKeyInterceptor(openAIProperties.getApiKey()));
        restTemplate.getInterceptors().add(new LoggingInterceptor());

        // Add error handler
        restTemplate.setErrorHandler(new OpenAIResponseErrorHandler());

        return restTemplate;
    }
}

package cu.aica.product_resource.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Autowired
    private Environment env;

    @Bean
    public Docket createRestApiV1() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfoV1())
                .groupName("Version-"+env.getProperty("cu.aica.api.v1.swagger.version"))
                .select()
                .apis(RequestHandlerSelectors.basePackage("cu.aica.product_resource.api.v1.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfoV1() {
        return new ApiInfoBuilder()
                .title(env.getProperty("cu.aica.api.v1.swagger.title"))
                .description(env.getProperty("cu.aica.api.v1.swagger.description"))
//                .termsOfServiceUrl("")
//                .contact(new Contact("", "", ""))
                .version(env.getProperty("cu.aica.api.v1.swagger.version"))
                .build();
    }
}


package cu.aica.product_resource.consuming.services;

import cu.aica.product_resource.consuming.models.Entity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class EntityService {

    @Value("${primary-source.url}")
    public String URL_PRIMARY_SOURCE;

    public List<Entity> getAllEntity(){
        RestTemplate restTemplate = new RestTemplate();
        List<Entity> list = new ArrayList<Entity>();
        try {
            list = restTemplate.exchange(
                    URL_PRIMARY_SOURCE+"/entidad",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Entity>>() {}
            ).getBody();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        return list;
    }
}

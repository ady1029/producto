package cu.aica.product_resource.consuming.services;

import cu.aica.product_resource.consuming.models.Lab;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class LabService {

    @Value("${primary-source.url}")
    public String URL_PRIMARY_SOURCE;

    public List<Lab> getAllLabs(Integer idEntity){
        RestTemplate restTemplate = new RestTemplate();
        List<Lab> list = new ArrayList<Lab>();
        try {
            list = restTemplate.exchange(
                    URL_PRIMARY_SOURCE+"/laboratorios?entidad="+(idEntity != null ? idEntity : ""),
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Lab>>() {}
            ).getBody();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        return list;
    }

    public Lab getLab(int idEntity, int codueb){

        List<Lab> labList = getAllLabs(idEntity);
        return labList.stream().filter(ele -> ele.getCodigo() == codueb).findFirst().orElse(new Lab());
    }
}

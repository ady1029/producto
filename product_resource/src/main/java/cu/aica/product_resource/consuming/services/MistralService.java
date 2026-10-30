package cu.aica.product_resource.consuming.services;

import cu.aica.product_resource.consuming.models.ProductMistral;
import cu.aica.product_resource.consuming.models.ResourceMistral;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class MistralService {


    @Value("${mistral.url}")
    public String URL_MISTRAL;

    public List<ProductMistral> getAllProduct(Integer codUeb, String seaarch){
        RestTemplate restTemplate = new RestTemplate();

        List<ProductMistral> list = new ArrayList<ProductMistral>();

        try {
            list = restTemplate.exchange(
                    URL_MISTRAL+"?ueb="+codUeb+"&almacen=Producto&buscar="+seaarch,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ProductMistral>>() {}
            ).getBody();
        } catch (Exception e){

        }

        return list;
    }

    public ProductMistral getProductMistral(Integer codUeb, String seaarch){
        List<ProductMistral> listMistral = getAllProduct(codUeb, seaarch);
        return listMistral.isEmpty() ? new ProductMistral() : listMistral.get(0);
    }

    public List<ResourceMistral> getAllResource(Integer codUeb, String storage,  String seaarch){
        RestTemplate restTemplate = new RestTemplate();
        List<ResourceMistral> list = new ArrayList<ResourceMistral>();
        try {
            list = restTemplate.exchange(
                    URL_MISTRAL+"?ueb="+codUeb+"&almacen="+storage+"&buscar="+seaarch,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ResourceMistral>>() {}
            ).getBody();
        } catch (Exception e){

        }
        return list;
    }

    public ResourceMistral getResource(Integer codUeb, String storage,  String seaarch) {
        List<ResourceMistral> listMistral = getAllResource(codUeb, storage, seaarch);
        return listMistral.isEmpty() ? new ResourceMistral() : listMistral.get(0);
    }
}

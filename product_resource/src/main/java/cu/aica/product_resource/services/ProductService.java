package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ProductDTO;
import cu.aica.product_resource.consuming.models.Lab;
import cu.aica.product_resource.models.Product;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;

import java.util.List;

public interface ProductService {

    List<ProductDTO> getAllFilter(Integer idProductFamily, String ueb, String name, String cup, String pharmaceuticShape, String market, String codigo);

    List<ProductDTO> getAllFilterWithoutMistral(Integer idProductFamily, List<Lab> labList);

    Product getById(int id);

    Product save(Product entity);

    DeleteResponse delete(int id);
}

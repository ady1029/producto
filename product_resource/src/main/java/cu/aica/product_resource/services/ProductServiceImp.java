package cu.aica.product_resource.services;

import cu.aica.product_resource.api.dto.ProductDTO;
import cu.aica.product_resource.consuming.services.LabService;
import cu.aica.product_resource.consuming.services.MistralService;
import cu.aica.product_resource.consuming.models.Lab;
import cu.aica.product_resource.consuming.models.ProductMistral;
import cu.aica.product_resource.models.Product;
import cu.aica.product_resource.models.ProductFamily;
import cu.aica.product_resource.repositorys.ProductRepository;
import cu.aica.product_resource.utils.exception.ResourceNotFoundException;
import cu.aica.product_resource.utils.payload.response.DeleteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductServiceImp implements ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private ProductFamilyService service;

    @Autowired
    private LabService labService;

    @Autowired
    private MistralService mistralService;

    public Iterable<Product> findAll() {

        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllFilter(Integer idProductFamily, String ueb, String name, String cup, String pharmaceuticShape, String market, String codigo){
        Iterable<Product> list = findByIdProductFamily(idProductFamily);

        List<ProductDTO> listDTO = new ArrayList<ProductDTO>();
        List<Lab> labList = labService.getAllLabs(null);

        list.forEach(item -> {

            Lab lab = labList.stream().filter(ele -> ele.getCodigo() == item.getCodUeb()).findFirst().orElse(new Lab());

            ProductMistral productMistral = mistralService.getProductMistral(item.getCodUeb(), item.getCup());

            ProductDTO productDTO = new ProductDTO(item.getId(), item.getIdProductFamily(), item.getCodUeb(), lab.getNombre(), productMistral.getName(),
                    item.getCup(), productMistral.getPharmaceuticShape(),
                    productMistral.getMarket() != null ? productMistral.getMarket() : "",
                    item.getCodigo() != null ? item.getCodigo() : "");

            if (productDTO.getUeb().toLowerCase().contains(ueb.toLowerCase()) &&
                    productDTO.getName().toLowerCase().contains(name.toLowerCase()) &&
                    productDTO.getCup().toLowerCase().contains(cup.toLowerCase()) &&
                    productDTO.getPharmaceuticShape().toLowerCase().contains(pharmaceuticShape.toLowerCase()) &&
                    productDTO.getMarket().toLowerCase().contains(market.toLowerCase()) &&
                    productDTO.getCodigo().toLowerCase().contains(codigo.toLowerCase())
                    )
                listDTO.add(productDTO);
        });

        return listDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllFilterWithoutMistral(Integer idProductFamily, List<Lab> labList){
        Iterable<Product> list = findByIdProductFamily(idProductFamily);

        List<ProductDTO> listDTO = new ArrayList<ProductDTO>();

        list.forEach(item -> {

            ProductDTO productDTO = new ProductDTO(item.getId(), item.getIdProductFamily(), item.getCodUeb(),
                    labList.stream().filter(ele -> ele.getCodigo().equals(item.getCodUeb())).findFirst().orElse(new Lab()).getNombre(),
                    "",
                    item.getCup(),
                    "",
                    "",
                    item.getCodigo() != null ? item.getCodigo() : "");

                listDTO.add(productDTO);
        });

        return listDTO;
    }

    private Iterable<Product> findByIdProductFamily(Integer idProductFamily) {

        return repository.findByIdProductFamilyEquals(idProductFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public Product getById(int id) {
        Optional<Product> item = repository.findById(id);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new ResourceNotFoundException("Record not found with id = " + id);
        }
    }

    @Override
    public Product save(Product entity) {
//        Product product = getById(entity.getId());
        return repository.save(entity);
    }

    @Override
    public DeleteResponse delete(int id) {
        DeleteResponse result = new DeleteResponse("successful");
        try {
            Product product = getById(id);
            ProductFamily temp = product.getProductFamily();
            if (temp.getProducts().size() > 1) {
                temp.getProducts().remove(product);
                service.save(temp);
                repository.delete(product);
            } else {
                result.setMessage("restricted");
            }

        } catch (Exception t) {
            result.setMessage("failed");
        }
        return result;
    }

}
